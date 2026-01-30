/**
 * Database Initialization Script
 * 데이터베이스 초기화 스크립트
 */

import { DatabaseManager } from '../features/reviews/infrastructure/database/DatabaseManager';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    const db = DatabaseManager.getInstance();
    await db.initialize();
    
    console.log('Database initialized successfully!');
    console.log('Tables created:');
    console.log('- reviews');
    console.log('- review_images');
    
    // 테스트 데이터 삽입 (옵션)
    const testReview = db.run(`
      INSERT INTO reviews (user_name, title, content, category)
      VALUES (?, ?, ?, ?)
    `, ['테스트사용자', '테스트 후기', '이것은 테스트 후기입니다.', '음식이 맛있어요']);
    
    console.log('Test review inserted with ID:', testReview.lastInsertRowid);
    
    // 데이터 확인
    const reviews = db.all('SELECT * FROM reviews');
    console.log('Current reviews:', reviews);
    
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  initializeDatabase().then(() => {
    console.log('Script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { initializeDatabase };
