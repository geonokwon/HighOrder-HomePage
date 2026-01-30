'use client';

import Image from 'next/image';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface Feature {
  title: string;
  mainImage: string;
  iconImage: string;
  position: 'left' | 'right';
}


const features: Feature[] = [
  {
    title: '장시간 안전한\n배터리 제공',
    mainImage: '/FeatureImages/Features_Image_1.png',
    iconImage: '/FeatureImages/Features_Icon_1.png',
    position: 'left',
  },
  {
    title: '끊김없이 안전한\n하이오더 와이파이',
    mainImage: '/FeatureImages/Features_Image_2.png',
    iconImage: '/FeatureImages/Features_Icon_2.png',
    position: 'right',
  },
  {
    title: '결제누락 방지 시스템',
    mainImage: '/FeatureImages/Features_Image_3.png',
    iconImage: '/FeatureImages/Features_Icon_3.png',
    position: 'left',
  },
  {
    title: '사장님 전용 어플 제공',
    mainImage: '/FeatureImages/Features_Image_4.png',
    iconImage: '/FeatureImages/Features_Icon_4.png',
    position: 'right',
  },
];

export function FeatureSection() {
  return (
    <AnimatedSection className="pt-20 pb-32 bg-transparent px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <AnimatedItem>
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 mb-16 leading-tight text-left">
            하이오더 주요 기능
          </h2>
        </AnimatedItem>

        {/* Features Grid with Overlapping Center Card */}
        <div className="relative">
          {/* Main Container for 2x2 Grid */}
          <AnimatedContainer className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto" staggerChildren={0.2}>
            {features.map((feature, index) => (
              <AnimatedItem
                key={feature.title}
                className="aspect-square rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#f1f1f1' }}
              >
                {/* Image Area */}
                <div className="h-3/4 p-6 flex items-center justify-center relative">
                  {/* Main Feature Image - Fixed Size */}
                  <div className="w-20 h-32 md:w-52 md:h-64 relative">
                    <Image
                      src={feature.mainImage}
                      alt={feature.title}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        console.log(`Failed to load image: ${feature.mainImage}`);
                      }}
                    />
                  </div>
                  
                  {/* Feature Icon - positioned based on left/right - Responsive */}
                  <div 
                    className={`absolute bottom-4 md:bottom-1 w-6 h-6 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
                      feature.position === 'left' ? 'left-5 md:left-4' : 'right-5 md:right-4'
                    }`}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 relative">
                      <Image
                        src={feature.iconImage}
                        alt={`${feature.title} icon`}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          console.log(`Failed to load icon: ${feature.iconImage}`);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <div className="h-1/4 px-6 pb-6 flex items-center">
                  <h3 
                    className={`text-sm md:text-2xl font-bold text-gray-700 leading-tight whitespace-pre-line ${
                      feature.position === 'left' ? 'text-left' : 'text-right'
                    }`}
                    style={{ width: '100%' }}
                  >
                    {feature.title}
                  </h3>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedContainer>

          {/* Center Circular Card - Overlapping */}
          <AnimatedItem delay={1.0} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-[124px] h-[124px] md:w-80 md:h-80 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden"
              style={{ backgroundColor: '#d9d9d9' }}
            >
              {/* Main Device Image - Direct in Circle */}
              <div className="w-24 h-24 md:w-64 md:h-64 relative">
                <Image
                  src="/FeatureImages/Features_Image_5.png"
                  alt="하이오더 태블릿 화면"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    console.log('Failed to load Features_Image_5.png');
                  }}
                />
              </div>
            </div>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedSection>
  );
} 