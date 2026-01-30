"use client";

interface AdditionalFeaturesDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onFeatureSelect: (feature: 'promotion' | 'event' | 'wifi' | 'game') => void;
}

export default function AdditionalFeaturesDropdown({ isOpen, onClose, onFeatureSelect }: AdditionalFeaturesDropdownProps) {
    if (!isOpen) return null;

    const features = [
        { id: 'event', label: '이벤트', disabled: false },
        { id: 'wifi', label: '와이파이', disabled: false },
        { id: 'promotion', label: '홍보', disabled: false },
        { id: 'game', label: '게임', disabled: true },
    ];

    const handleFeatureClick = (featureId: 'promotion' | 'event' | 'wifi' | 'game') => {
        onFeatureSelect(featureId);
        // 드롭다운은 열린 상태로 유지 (튜토리얼을 위해)
        // onClose();
    };

    return (
        <div className="absolute top-[50px] right-[24px] z-50">
            {/* 화살표 - 작은 삼각형 */}
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white ml-[60px]"></div>
            
            {/* 드롭다운 컨테이너 */}
            <div className="bg-white rounded-lg w-[160px] border border-gray-200" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'}}>
                {/* 드롭다운 리스트 */}
                <div className="py-2">
                    {features.map((feature, index) => (
                        <button
                            key={feature.id}
                            onClick={() => !feature.disabled && handleFeatureClick(feature.id as 'promotion' | 'event' | 'wifi' | 'game')}
                            disabled={feature.disabled}
                            className={`w-full h-[36px] flex items-center justify-start px-3 transition-colors ${
                                feature.disabled 
                                    ? 'cursor-not-allowed opacity-50' 
                                    : 'hover:bg-gray-50 cursor-pointer'
                            }`}
                            style={{ 
                                borderBottom: index < features.length - 1 ? '1px solid #e5e5e5' : 'none'
                            }}
                            data-additional-feature-item={feature.id}
                        >
                            <span 
                                className={`text-[13px] font-normal ${
                                    feature.disabled ? 'text-[#999999]' : 'text-[#515151]'
                                }`}
                                style={{ fontFamily: 'BM Jua' }}
                            >
                                {feature.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
