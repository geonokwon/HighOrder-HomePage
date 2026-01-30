import {
  HeroSection,
  NavigationSection,
  ProblemSection,
  SolutionSection,
  FeatureSection,
  DemoSection,
  PointSection,
  PGChargeSection,
  ImageSection,
  ProgressSection,
  FAQSection,
  ASSection,
  ActionSection,
  PriceSection,
  MembershipSection,
  ReviewSection,
  ComparisonSection,
  ExpertCareSection,
  MarqueeSection,
  ReviewPreviewSection,
  ChecklistSection,
  ExpandableImageSection,
  FreeResourceSection,
} from '@/presentation/sections';

import { HomeWithPopup } from '@/presentation/components';

export default function Home() {
  return (
    <HomeWithPopup>
    <main className="w-full">
      {/* 1. HeroSection부터 SolutionSection까지 오렌지→흰색 그라데이션 배경 */}
      <div className="bg-gradient-to-b from-orange-400 via-orange-300 to-white relative">
        <div id="hero-section">
          <HeroSection />
        </div>
        {/* 유튜브 영상 섹션 */}
        <ProblemSection />
        <ExpandableImageSection imageSrc="/ExpandableImage/Massage_Text.png" />
        
        <ChecklistSection />
        
        {/* 네비게이션 섹션 */}
        <NavigationSection />
        {/* 솔루션 섹션 */}
        <div id="feature-section">
          <SolutionSection />
        </div>
        {/* 비교 섹션 */}
        <PGChargeSection />
        <ComparisonSection />
      </div>

      {/* 2. FeatureSection - 독립적인 흰색 배경 */}
      <div className="relative">
        <FeatureSection />
        {/* FeatureSection 하단 물결 - 자연스러운 배치 */}
        <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden z-10 pointer-events-none">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,40 Q300,0 600,20 Q900,40 1200,0 V120 H0 Z" 
              fill="currentColor"
              className="text-orange-100"
            />
          </svg>
        </div>
      </div>

      {/* 3. DemoSection부터 FAQSection까지 - 위쪽과 동일한 구조 */}
      <div className="relative">
        <div className="bg-gradient-to-b from-orange-100 to-white pb-24">
          <div id="demo-section">
            <DemoSection />
          </div>
          <div id="point-section">
            <PointSection />
          </div>
          <PriceSection />
          <div id="benefit-section">
            <ExpertCareSection />
          </div>
        </div>
        <div className="bg-[#F1F1F1] pb-24">
          <ImageSection />
        </div>
        <div className="bg-[#FAE7C8] pb-4 md:pb-24">
          <MembershipSection />
          <FreeResourceSection />
        </div>
        <div className="bg-gradient-to-b from-orange-100 to-orange-50">
          <div id="review-section">
            <ReviewSection />
          </div>
          <div id="review-preview-section">
            <ReviewPreviewSection />
          </div>
        </div>
        <MarqueeSection />
        <div className="bg-white pb-4">
          <ProgressSection />
        </div>
        <div className="bg-white pb-24">
          <FAQSection />
        </div>
        
        {/* FAQSection 하단 물결 - FeatureSection과 정확히 동일한 구조 */}
        <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden z-10 pointer-events-none">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            {/* 기존 그라데이션 정의 제거 후 동일한 색상 적용 */}
            <path 
              d="M0,40 Q300,0 600,20 Q900,40 1200,0 V120 H0 Z" 
              fill="currentColor"
              className="text-orange-100"
            />
          </svg>
        </div>
      </div>
      
      {/* 4. ASSection - 오렌지 배경 */}
      <div className="bg-gradient-to-b from-orange-100 via-orange-200 to-white pt-24">
        <ASSection />
      </div>

      {/* 5. ActionSection - 흰색 배경 */}
      <div className="bg-white" id="action-section">
        <ActionSection />
      </div>
    </main>
    </HomeWithPopup>
  );
} 