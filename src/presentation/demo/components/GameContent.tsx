"use client";

interface GameContentProps {
    onClose: () => void;
}

export default function GameContent({ onClose }: GameContentProps) {
    return (
        <div 
            className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl p-8 max-w-[800px] max-h-[600px] cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'BM Jua' }}>
                        게임
                    </h2>
                    <div className="bg-gray-200 rounded-lg p-8 mb-4">
                        <p className="text-gray-600" style={{ fontFamily: 'BM Jua' }}>
                            게임 콘텐츠가 여기에 표시됩니다
                        </p>
                        {/* 실제 게임 콘텐츠가 있다면 여기에 추가 */}
                    </div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'BM Jua' }}>
                        아무곳이나 클릭하면 메뉴로 돌아갑니다
                    </p>
                </div>
            </div>
        </div>
    );
}
