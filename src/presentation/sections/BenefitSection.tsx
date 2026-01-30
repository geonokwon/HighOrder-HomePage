import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

const benefits = [
  '10대 이상 주문 시 POS 무상 지원',
  '주방 프린터 무료 포함',
  '추가 현금 지원 제공',
];

export function BenefitSection() {
  return (
    <AnimatedSection className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <AnimatedItem>
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-6">
            kt지니원 전용 혜택
          </h2>
        </AnimatedItem>
        <AnimatedContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" staggerChildren={0.2}>
          {benefits.map((b) => (
            <AnimatedItem
              key={b}
              className="p-6 border border-red-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-lg font-semibold text-red-600">{b}</span>
            </AnimatedItem>
          ))}
        </AnimatedContainer>
      </div>
    </AnimatedSection>
  );
} 