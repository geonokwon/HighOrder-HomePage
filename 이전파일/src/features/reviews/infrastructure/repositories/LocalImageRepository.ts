/**
 * Local Image Repository Implementation
 * 로컬 파일 시스템 기반 이미지 리포지토리 구현체 (NAS 마운트 대응)
 */

import { ImageRepository } from '../../domain/repositories/ImageRepository';
import { databaseConfig, getImageUrl } from '../config/database.config';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class LocalImageRepository implements ImageRepository {

  constructor() {
    this.ensureDirectoryExists();
  }

  async saveImage(file: File, reviewId: string): Promise<string> {
    await this.validateImage(file);
    
    const fileName = this.generateFileName(file);
    const absolutePath = join(databaseConfig.imagesPath, reviewId, fileName);
    
    // 후기별 디렉토리 생성
    const reviewDir = join(databaseConfig.imagesPath, reviewId);
    await this.ensureDirectoryExists(reviewDir);
    
    // 파일 저장
    const buffer = await this.fileToBuffer(file);
    await fs.writeFile(absolutePath, buffer);
    
    // 웹 접근 가능한 상대 경로 반환 (API 라우트를 통해 서빙)
    const webPath = `/uploads/reviews/${reviewId}/${fileName}`;
    return webPath;
  }

  async saveImages(files: File[], reviewId: string): Promise<string[]> {
    const imagePaths: string[] = [];
    
    for (const file of files) {
      const imagePath = await this.saveImage(file, reviewId);
      imagePaths.push(imagePath);
    }
    
    return imagePaths;
  }

  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      await fs.unlink(imagePath);
      return true;
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  }

  async deleteImagesByReviewId(reviewId: string): Promise<boolean> {
    try {
      const reviewDir = join(databaseConfig.imagesPath, reviewId);
      
      // 디렉토리가 존재하는지 확인
      const dirExists = await this.directoryExists(reviewDir);
      if (!dirExists) return true;
      
      // 디렉토리 내 모든 파일 삭제
      const files = await fs.readdir(reviewDir);
      await Promise.all(
        files.map(file => fs.unlink(join(reviewDir, file)))
      );
      
      // 빈 디렉토리 삭제
      await fs.rmdir(reviewDir);
      
      return true;
    } catch (error) {
      console.error('Failed to delete images by review ID:', error);
      return false;
    }
  }

  async imageExists(imagePath: string): Promise<boolean> {
    try {
      await fs.access(imagePath);
      return true;
    } catch {
      return false;
    }
  }

  getImageUrl(imagePath: string): string {
    return getImageUrl(imagePath);
  }

  /**
   * 파일을 Buffer로 변환 (서버 환경)
   */
  private async fileToBuffer(file: File): Promise<Buffer> {
    try {
      // 서버 환경에서 File 객체의 arrayBuffer() 메서드 사용
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('File to buffer conversion failed:', error);
      throw new Error('Failed to convert file to buffer');
    }
  }

  /**
   * 고유한 파일명 생성
   */
  private generateFileName(file: File): string {
    const uuid = uuidv4();
    const extension = extname(file.name);
    return `${uuid}${extension}`;
  }

  /**
   * 이미지 파일 유효성 검증
   */
  private async validateImage(file: File): Promise<void> {
    // 파일 크기 검증
    if (file.size > databaseConfig.maxImageSize) {
      throw new Error(`이미지 파일 크기는 ${databaseConfig.maxImageSize / 1024 / 1024}MB 이하여야 합니다`);
    }

    // 파일 타입 검증
    if (!databaseConfig.supportedImageTypes.includes(file.type)) {
      throw new Error(`지원되지 않는 이미지 형식입니다. 지원 형식: ${databaseConfig.supportedImageTypes.join(', ')}`);
    }
  }

  /**
   * 디렉토리 존재 여부 확인
   */
  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * 디렉토리 생성 (재귀적)
   */
  private async ensureDirectoryExists(dirPath?: string): Promise<void> {
    const targetPath = dirPath || databaseConfig.imagesPath;
    
    try {
      const exists = await this.directoryExists(targetPath);
      
      if (!exists) {
        await fs.mkdir(targetPath, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create directory:', error);
      throw error;
    }
  }
}
