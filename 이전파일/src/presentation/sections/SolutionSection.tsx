import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

const solutions = [
    {
        title: '안정적인 시스템',
        subtitle: '✓ 업계유일 대기업',
        description: '✓ 국내 네트워크 기술1위',
        backgroundImage: '/Solution/Solution_Card_Image1.png', 
    },
    {
        title: '신속한 A/S인프라',
        subtitle: '✓ 전국 152개 직영 A/S센터',
        description: '✓ 24시간 내 출동서비스',
        backgroundImage: '/Solution/Solution_Card_Image2.png', 
    },
    {
        title: '프리미엄 단말기',
        subtitle: '✓ 삼성패널 사용',
        description: '✓ 잔고장 없음',
        backgroundImage: '/Solution/Solution_Card_Image3.png', 
    },
    {
        title: '결제누락 방지특허',
        subtitle: '✓ 오직 KT만 제공',
        description: '✓ 결제 누락 0건',
        backgroundImage: '/Solution/Solution_Card_Image4.png',
    },
];

export function SolutionSection() {
    return (
        <AnimatedSection className="w-full py-20 bg-transparent px-4">
            <div className="max-w-7xl mx-auto">
                {/* Title Section */}
                <AnimatedItem className="mb-16">
                    <h2
                        className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-4"
                    >
                        사장님들이! {' '}
                        <span className="text-gray-700">KT하이오더를 선택하는 이유!</span>
                    </h2>
                    <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed">
                        같은 것도 KT에서 만들면 품질과 서비스가 다릅니다.
                    </p>
                </AnimatedItem>

                {/* Solution Cards */}
                <AnimatedContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10" staggerChildren={0.2}>
                    {solutions.map(({ title, subtitle, description, backgroundImage }) => (
                        <AnimatedItem
                            key={title}
                            className="rounded-xl overflow-hidden relative"
                            style={{ minHeight: '160px' }}
                        >
                            {/* 배경 이미지 */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ 
                                    backgroundImage: `url(${backgroundImage})`,
                                }}
                            />
                            
                            {/* 오버레이 (텍스트 가독성을 위한 반투명 배경) */}
                            {/* <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl" /> */}
                            
                            {/* 카드 내용 */}
                            <div className="relative z-10 h-full flex flex-col justify-center items-center p-2 md:p-4 text-center">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-2 leading-tight">
                                    {title}
                                </h3>
                                <p className="text-sm sm:text-base font-medium text-white mb-1">
                                    {subtitle}
                                </p>
                                <p className="text-sm sm:text-base font-medium text-white ">
                                    {description}
                                </p>
                            </div>
                        </AnimatedItem>
                    ))}
                </AnimatedContainer>
            </div>
        </AnimatedSection>
    );
} 