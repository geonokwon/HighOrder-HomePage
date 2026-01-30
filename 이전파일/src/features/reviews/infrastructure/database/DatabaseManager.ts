/**
 * SQLite Database Manager
 * SQLite 데이터베이스 관리자
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { databaseConfig } from '../config/database.config';

export interface DatabaseRow {
  [key: string]: any;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: any = null; // SQLite database instance

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 데이터베이스 초기화
   */
  public async initialize(): Promise<void> {
    try {
      // 동적 import를 사용하여 SQLite 모듈 로드
      const Database = (await import('better-sqlite3')).default;
      
      console.log('Database path:', databaseConfig.databasePath);
      console.log('Current working directory:', process.cwd());
      
      // 데이터베이스 디렉토리 확인 및 생성
      const path = require('path');
      const fs = require('fs');
      const dbDir = path.dirname(databaseConfig.databasePath);
      
      console.log('Database directory:', dbDir);
      
      // 디렉토리가 존재하지 않으면 생성
      if (!fs.existsSync(dbDir)) {
        console.log('Creating database directory:', dbDir);
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      // 데이터베이스 연결
      this.db = new Database(databaseConfig.databasePath);
      console.log('Database connection established');
      
      // WAL 모드 설정 (성능 최적화)
      this.db.pragma('journal_mode = WAL');
      
      // 기존 데이터 확인
      try {
        const existingReviews = this.db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
        console.log('Existing reviews count:', existingReviews.count);
      } catch (e) {
        console.log('No existing reviews table found, will create schema');
      }
      
      // 스키마 초기화
      await this.initializeSchema();
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      console.error('Error details:', error);
      throw error;
    }
  }

  /**
   * 스키마 초기화
   */
  private async initializeSchema(): Promise<void> {
    try {
      // 테이블 생성
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name VARCHAR(100) NOT NULL,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(50) NOT NULL,
            password VARCHAR(255), -- 해시된 비밀번호 저장
            created_at DATETIME NOT NULL DEFAULT (datetime('now')),
            updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE
        );
      `);

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS review_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            review_id INTEGER NOT NULL,
            image_path VARCHAR(500) NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            file_size INTEGER NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
        );
      `);

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            review_id INTEGER NOT NULL,
            author_name VARCHAR(50) NOT NULL,
            author_role VARCHAR(10) NOT NULL CHECK (author_role IN ('admin', 'user')),
            content TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT (datetime('now')),
            updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
        );
      `);

      // 인덱스 생성
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_category ON reviews(category);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_is_deleted ON reviews(is_deleted);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_review_images_sort_order ON review_images(sort_order);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_review_id ON comments(review_id);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_author_role ON comments(author_role);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);`);
      this.db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_is_deleted ON comments(is_deleted);`);

      // 트리거 생성
      this.db.exec(`
        CREATE TRIGGER IF NOT EXISTS update_reviews_updated_at 
            AFTER UPDATE ON reviews
            FOR EACH ROW
            BEGIN
                UPDATE reviews SET updated_at = datetime('now') WHERE id = NEW.id;
            END;
      `);

      this.db.exec(`
        CREATE TRIGGER IF NOT EXISTS update_comments_updated_at 
            AFTER UPDATE ON comments
            FOR EACH ROW
            BEGIN
                UPDATE comments SET updated_at = datetime('now') WHERE id = NEW.id;
            END;
      `);

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Schema initialization failed:', error);
      throw error;
    }
  }

  /**
   * 단일 조회 쿼리 실행
   */
  public get(query: string, params: any[] = []): DatabaseRow | undefined {
    try {
      const stmt = this.db.prepare(query);
      return stmt.get(...params);
    } catch (error) {
      console.error('Database get query failed:', error);
      throw error;
    }
  }

  /**
   * 다중 조회 쿼리 실행
   */
  public all(query: string, params: any[] = []): DatabaseRow[] {
    try {
      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error('Database all query failed:', error);
      throw error;
    }
  }

  /**
   * 실행 쿼리 (INSERT, UPDATE, DELETE)
   */
  public run(query: string, params: any[] = []): { lastInsertRowid: number; changes: number } {
    try {
      const stmt = this.db.prepare(query);
      return stmt.run(...params);
    } catch (error) {
      console.error('Database run query failed:', error);
      throw error;
    }
  }

  /**
   * SQL 문 실행 (결과 반환 없음)
   */
  public exec(sql: string): void {
    try {
      this.db.exec(sql);
    } catch (error) {
      console.error('Database exec failed:', error);
      throw error;
    }
  }

  /**
   * 트랜잭션 실행
   */
  public transaction<T>(callback: () => T): T {
    try {
      const transaction = this.db.transaction(callback);
      return transaction();
    } catch (error) {
      console.error('Database transaction failed:', error);
      throw error;
    }
  }

  /**
   * 데이터베이스 연결 종료
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * 데이터베이스 연결 상태 확인
   */
  public isConnected(): boolean {
    return this.db !== null;
  }
}
