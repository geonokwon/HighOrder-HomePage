/**
 * Database Configuration
 * 데이터베이스 설정
 */

export interface DatabaseConfig {
  databasePath: string;
  imagesPath: string;
  maxImageSize: number; // bytes
  maxImagesPerReview: number;
  supportedImageTypes: string[];
}

export const databaseConfig: DatabaseConfig = {
  // SQLite 데이터베이스 파일 경로 (환경에 따라 다름)
  databasePath: process.env.DATABASE_PATH || (process.env.NODE_ENV === 'development' ? './data/reviews.db' : '/app/data/reviews.db'),
  
  // 이미지 저장 경로 (환경에 따라 다름)
  imagesPath: process.env.IMAGES_PATH || (process.env.NODE_ENV === 'development' ? './public/uploads/reviews' : '/app/public/uploads/reviews'),
  
  // 최대 이미지 파일 크기 (5MB)
  maxImageSize: 5 * 1024 * 1024,
  
  // 후기당 최대 이미지 개수
  maxImagesPerReview: 4,
  
  // 지원되는 이미지 타입
  supportedImageTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ]
};

export const getImageUrl = (imagePath: string): string => {
  // 절대 경로인 경우 그대로 반환, 상대 경로인 경우 웹 경로로 변환
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  // NAS 마운트 경로를 웹 접근 가능한 URL로 변환
  // API 라우트를 통해 이미지 서빙
  return imagePath.replace(databaseConfig.imagesPath, '/uploads');
};
