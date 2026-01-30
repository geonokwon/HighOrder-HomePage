# HighOrder HomePage

> 식당 태블릿 주문 시스템을 위한 현대적이고 인터랙티브한 랜딩 페이지

[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 프로젝트 소개

HighOrder는 식당 운영을 위한 태블릿 주문 시스템 서비스의 홍보 및 고객 유입을 위한 랜딩 페이지입니다. 실제 서비스 사용을 시뮬레이션할 수 있는 **인터랙티브 데모**, AI 기반 **시나리오 챗봇**, 식당 운영에 필요한 **실무 계산기** 등을 제공하여 잠재 고객에게 직관적인 경험을 제공합니다.

### 🎯 핵심 기능

#### 🎨 프론트엔드 (사용자 페이지)

-   **UI/UX**: Framer Motion 기반의 부드러운 애니메이션과 반응형 디자인
-   **하이오더 데모**: 실제 태블릿 주문 시스템을 체험할 수 있는 시뮬레이터
-   **AI 시나리오 챗봇**: 시각적 플로우 에디터를 통한 대화형 고객 상담 시스템
-   **실무 계산기 허브**: 식당 운영에 필요한 10종의 계산기 도구
    -   주휴수당, 최저임금 인건비, 퇴직금 계산기
    -   손익분기점, 마진율, 부가세 계산기
    -   재고 회전율, 매출 예측 계산기 등
-   **고객 리뷰 시스템**: 평점, 댓글, 이미지 업로드 기능을 갖춘 후기 시스템
-   **동영상 갤러리**: 서비스 소개 및 사용 설명 영상
-   **이벤트 팝업**: 맞춤형 프로모션 및 공지사항 팝업

#### 🛠 백오피스 (관리자 페이지)

-   **🔐 JWT 기반 인증 시스템**: 관리자 로그인 및 세션 관리
-   **📊 실시간 방문자 분석 대시보드**
    -   일별/월별/연도별 방문자 통계 및 차트 시각화 (Recharts)
    -   유입 경로(Source/Medium) 분석 및 필터링
    -   사용자 에이전트 및 Referrer 추적
    -   PDF 다운로드 통계 (일/월/년 단위 집계)
-   **🎭 이벤트 팝업 관리**
    -   최대 5개 팝업 이미지 업로드 및 순서 조정
    -   팝업별 활성화/비활성화 토글
    -   버튼 URL 설정 (CTA 링크 연결)
    -   이미지 미리보기 및 삭제 기능
-   **📢 배너 관리 시스템**
    -   상단 배너 텍스트, 배경색, 글자색 커스터마이징
    -   PDF 파일 업로드 및 다운로드 제공
    -   배너 활성화/비활성화 토글
-   **🎬 YouTube 동영상 관리**
    -   YouTube Video ID 설정 및 실시간 미리보기
    -   메인 페이지 동영상 섹션 콘텐츠 관리
-   **💬 고객 리뷰 관리 (Clean Architecture)**
    -   리뷰 목록 조회 및 통계 (평균 평점, 총 개수)
    -   관리자 권한 리뷰 삭제 (JWT 토큰 검증)
    -   댓글 CRUD (생성, 수정, 삭제)
    -   이미지 업로드 및 관리 (최대 4장, 5MB 제한)
    -   카테고리별/평점별 필터링
-   **🤖 챗봇 시나리오 에디터**
    -   React Flow 기반 노드 기반 시각적 에디터
    -   텍스트/옵션 노드, 카드 캐러셀 노드 생성
    -   시나리오 저장/불러오기 기능
    -   대화 흐름 실시간 미리보기
-   **📧 문의 관리 시스템**
    -   고객 문의 수신 및 이메일 알림 (Nodemailer)
    -   문의 내용 데이터베이스 저장

---

## 🛠 기술 스택

### Frontend

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Emotion
-   **UI Components**: Radix UI, Material-UI
-   **Animation**: Framer Motion
-   **State Management**: Zustand
-   **Form Handling**: React Hook Form
-   **Charts**: Recharts

### Backend & Database

-   **Runtime**: Node.js (Express)
-   **Database**: Better-SQLite3
-   **Authentication**: JWT, bcrypt
-   **File Upload**: Multer
-   **Email**: Nodemailer

### DevOps

-   **Containerization**: Docker (Multi-stage build)
-   **Testing**: Jest, React Testing Library
-   **Package Manager**: npm
-   **CI/CD Ready**: Dockerfile 포함

---

## 📂 프로젝트 구조

```
src/
├── app/                      # Next.js 15 App Router
│   ├── page.tsx             # 메인 랜딩 페이지
│   ├── layout.tsx           # 전역 레이아웃
│   └── api/                 # API Routes
├── calculators/             # 계산기 기능 모듈
│   ├── components/          # 계산기 UI 컴포넌트
│   ├── pages/               # 개별 계산기 페이지
│   │   └── calculators/     # 10종 계산기 구현
│   ├── types/               # 계산기 타입 정의
│   └── utils/               # 계산 로직 유틸
├── presentation/            # 프레젠테이션 레이어
│   ├── sections/            # 랜딩 페이지 섹션 (26개)
│   │   ├── HeroSection.tsx
│   │   ├── DemoSection.tsx
│   │   ├── FeatureSection.tsx
│   │   └── ...
│   ├── components/          # 공통 컴포넌트
│   │   ├── ChatbotWidget.tsx
│   │   ├── EventPopup.tsx
│   │   └── NavBar.tsx
│   ├── chatbot/            # AI 챗봇 모듈
│   │   ├── components/     # 챗봇 UI (Flow Editor)
│   │   └── store/          # 챗봇 상태 관리
│   └── demo/               # POS 데모 기능
│       └── components/     # 데모 UI 컴포넌트
├── shared/                 # 공유 모듈
│   ├── components/ui/      # shadcn/ui 기반 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   └── utils/              # 유틸리티 함수
├── features/               # 기능별 모듈
├── core/                   # 핵심 비즈니스 로직
└── scripts/                # 데이터베이스 초기화 스크립트
```

### 아키텍처 특징

-   **Clean Architecture**: Presentation - Business Logic - Data 레이어 분리
-   **Feature-based Structure**: 기능별 모듈화로 확장성 확보
-   **Component-driven**: 재사용 가능한 컴포넌트 중심 설계
-   **Type Safety**: TypeScript를 통한 타입 안정성 보장

---

## 🚀 시작하기

### 요구사항

-   Node.js 20.x 이상
-   npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/geonokwon/HighOrder-HomePage.git
cd HighOrder-HomePage

# 의존성 설치
npm install

# 데이터베이스 초기화
npm run db:init
```

### 개발 서버 실행

```bash
# Next.js 개발 서버만 실행
npm run dev

# Next.js + 챗봇 서버 동시 실행
npm run dev:all
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 빌드 & 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### Docker 실행

```bash
# Docker 이미지 빌드
docker build -t highorder-homepage .

# 컨테이너 실행
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/src/chatbot/data:/app/src/chatbot/data \
  highorder-homepage
```

---

## 🧪 테스트

```bash
# Jest 테스트 실행
npm test

# 테스트 커버리지 확인
npm test -- --coverage
```

---

## 📊 주요 구현 사항

### 1. 반응형 디자인

-   모바일, 태블릿, 데스크톱 환경 최적화
-   Tailwind CSS를 활용한 유틸리티 우선 스타일링
-   다크모드 지원 (next-themes)

### 2. 성능 최적화

-   Next.js 15의 App Router 활용 (서버 컴포넌트)
-   이미지 최적화 (next/image)
-   코드 스플리팅 및 Lazy Loading
-   Docker 멀티 스테이지 빌드로 경량화

### 3. 사용자 경험 (UX)

-   Framer Motion 기반 페이지 전환 애니메이션
-   Intersection Observer를 활용한 스크롤 애니메이션
-   인터랙티브 튜토리얼 오버레이
-   실시간 유효성 검사 (React Hook Form)

### 4. 데이터 관리

-   Better-SQLite3로 경량 DB 구현
-   Zustand를 통한 전역 상태 관리
-   RESTful API 설계
-   파일 업로드 및 관리 (Multer)

### 5. 챗봇 시스템

-   React Flow 기반 비주얼 시나리오 에디터
-   노드 기반 대화 흐름 설계
-   카드 캐러셀, 옵션 버튼 등 리치 메시지 지원
-   시나리오 저장 및 불러오기

---

## 🎨 UI 컴포넌트

shadcn/ui 기반의 40+ 재사용 가능한 컴포넌트:

-   Accordion, Alert Dialog, Avatar, Badge
-   Button, Calendar, Card, Carousel
-   Chart, Checkbox, Command, Context Menu
-   Dialog, Drawer, Dropdown Menu, Form
-   Hover Card, Input, Label, Navigation Menu
-   Popover, Progress, Radio Group, Select
-   Sheet, Sidebar, Slider, Switch, Table
-   Tabs, Textarea, Toast, Tooltip 등

---

## 🔐 보안

-   JWT 기반 인증 시스템
-   bcrypt를 통한 비밀번호 암호화
-   환경변수를 통한 민감정보 관리 (.env)
-   CORS 설정

---

## 📈 개발 프로세스

-   **버전 관리**: Git/GitHub
-   **코드 품질**: ESLint, TypeScript strict mode
-   **테스트**: Jest + React Testing Library
-   **스타일 가이드**: Prettier (설정 가능)
-   **커밋 컨벤션**: Conventional Commits

---

## 🎯 학습 포인트 & 기술적 성과

### 1. 모던 웹 개발 스택 숙달

-   Next.js 15 App Router의 서버/클라이언트 컴포넌트 패턴 적용
-   TypeScript를 활용한 타입 세이프한 개발 경험
-   Tailwind CSS로 빠른 UI 프로토타이핑 및 일관된 디자인 시스템 구축

### 2. 복잡한 상태 관리

-   Zustand를 활용한 경량 전역 상태 관리
-   React Hook Form으로 폼 성능 최적화
-   챗봇 시나리오의 복잡한 상태 흐름 설계 및 구현

### 3. 사용자 중심 설계

-   26개의 섹션으로 구성된 체계적인 정보 구조
-   인터랙티브 데모를 통한 직관적인 서비스 이해 제공
-   실무 계산기를 통한 실질적 가치 제공

### 4. 풀스택 개발 역량

-   Next.js API Routes를 활용한 백엔드 구현
-   SQLite를 통한 데이터베이스 설계 및 관리
-   Docker를 활용한 컨테이너화 및 배포 준비

### 5. 성능 및 최적화

-   멀티 스테이지 Docker 빌드로 이미지 크기 최소화
-   이미지 최적화 및 Lazy Loading 적용
-   번들 크기 최적화 및 코드 스플리팅

---
