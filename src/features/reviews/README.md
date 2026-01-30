# 후기 리뷰 시스템

Clean Architecture 원칙을 적용한 후기 리뷰 기능 모듈입니다.

## 🏗️ 아키텍처 구조

```
src/features/reviews/
├── domain/              # 도메인 계층 (비즈니스 로직)
│   ├── entities/        # 엔티티 정의
│   ├── repositories/    # 리포지토리 인터페이스
│   └── validators/      # 도메인 검증 로직
├── application/         # 애플리케이션 계층 (유즈케이스)
│   ├── usecases/        # 유즈케이스 구현
│   └── stores/          # 상태 관리
├── infrastructure/     # 인프라스트럭처 계층 (외부 의존성)
│   ├── repositories/    # 리포지토리 구현체
│   ├── database/        # 데이터베이스 관련
│   └── config/          # 설정 파일
└── presentation/       # 프레젠테이션 계층 (UI)
    ├── components/      # React 컴포넌트
    ├── hooks/           # 커스텀 훅
    └── pages/           # 페이지 컴포넌트

```

## 🗄️ 데이터베이스 설계

## 데이터베이스 설계 부분 

### SQLite 스키마
- reviews 후기 정보 저장
- review_images 후기 이미지 메타데이터 저장 (실제 파일은 NAS에 저장)

### 특징
- 이미지는 NAS 볼륨 마운트로 로컬 파일 시스템에 저장
- 데이터베이스에는 이미지 경로만 저장
- 소프트 삭제 지원 (is_deleted 플래그)

## 🚀 사용법

### 1. 페이지 접근
```
/reviews
```

### 2. 의존성 주입
```typescript
// 리포지토리 인스턴스 생성
const imageRepository = new LocalImageRepository();
const reviewRepository = new SqliteReviewRepository(imageRepository);

// 유즈케이스 인스턴스 생성
const getReviewsUseCase = new GetReviewsUseCase(reviewRepository);
const createReviewUseCase = new CreateReviewUseCase(reviewRepository);
const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepository);
```

### 3. 커스텀 훅 사용
```typescript
const {
  reviews,
  stats,
  loading,
  error,
  refreshReviews,
  deleteReview
} = useReviews({
  getReviewsUseCase,
  createReviewUseCase,
  deleteReviewUseCase
});
```

## 🧪 테스트

### 도메인 로직 테스트
```bash
npm test ReviewValidator.test.ts
```

### 테스트 커버리지
- [x] ReviewValidator 검증 로직
- [ ] Use Cases 테스트 (추가 필요)
- [ ] Repository 테스트 (추가 필요)

## 📦 환경 설정

### 필수 패키지
```json
{
  "better-sqlite3": "SQLite 데이터베이스",
  "uuid": "고유 ID 생성"
}
```

### 환경 변수
```env
DATABASE_PATH=./data/reviews.db
IMAGES_PATH=./public/uploads/reviews
```

## 🔧 설정

### 이미지 업로드 제한
- 최대 파일 크기: 5MB
- 지원 형식: JPG, PNG, GIF, WebP
- 후기당 최대 이미지: 4개

### 데이터베이스 초기화
데이터베이스는 애플리케이션 시작 시 자동으로 초기화됩니다.

## 🎯 주요 기능

1. 후기 작성: 평점, 카테고리, 이미지 포함 후기 작성
2. 후기 조회: 전체/카테고리별/평점별 후기 조회
3. 후기 통계: 평균 평점, 총 개수, 만족도 통계
4. 후기 삭제: 소프트 삭제 방식
5. 이미지 관리: NAS 마운트 기반 이미지 저장/관리

## 🔐 보안 고려사항

1. 입력 검증: 모든 사용자 입력에 대한 검증
2. 욕설 필터: 부적절한 내용 필터링 (기본 구현)
3. 파일 업로드: 파일 타입 및 크기 제한
4. SQL 인젝션: Prepared Statement 사용

## 📈 확장성

1. 모듈형 설계 기능별 독립적 모듈
2. 의존성 역전 인터페이스 기반 설계
3. 테스트 가능 단위 테스트 지원
4. 재사용성 다른 프로젝트에서도 활용 가능
