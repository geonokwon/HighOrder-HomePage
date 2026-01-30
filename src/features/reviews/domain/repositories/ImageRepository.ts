/**
 * Image Repository Interface
 * 이미지 리포지토리 인터페이스 - NAS 볼륨 마운트 대응
 */

export interface ImageRepository {
  /**
   * 이미지 파일 저장
   * @param file 업로드된 파일
   * @param reviewId 후기 ID
   * @returns 저장된 파일 경로
   */
  saveImage(file: File, reviewId: string): Promise<string>;

  /**
   * 여러 이미지 파일 저장
   * @param files 업로드된 파일들
   * @param reviewId 후기 ID
   * @returns 저장된 파일 경로들
   */
  saveImages(files: File[], reviewId: string): Promise<string[]>;

  /**
   * 이미지 파일 삭제
   * @param imagePath 이미지 파일 경로
   */
  deleteImage(imagePath: string): Promise<boolean>;

  /**
   * 후기의 모든 이미지 삭제
   * @param reviewId 후기 ID
   */
  deleteImagesByReviewId(reviewId: string): Promise<boolean>;

  /**
   * 이미지 파일 존재 여부 확인
   * @param imagePath 이미지 파일 경로
   */
  imageExists(imagePath: string): Promise<boolean>;

  /**
   * 이미지 URL 생성 (NAS 마운트 경로 고려)
   * @param imagePath 이미지 파일 경로
   */
  getImageUrl(imagePath: string): string;
}
