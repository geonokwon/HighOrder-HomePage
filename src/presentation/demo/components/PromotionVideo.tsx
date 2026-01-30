"use client";

interface PromotionVideoProps {
    onClose: () => void;
}

export default function PromotionVideo({ onClose }: PromotionVideoProps) {
    return (
        <div 
            className="w-full h-full bg-black flex items-center justify-center cursor-pointer"
            onClick={onClose}
        >
            <video 
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
            >
                <source src="/DemoImages/Video/PromotionVideo.mov" type="video/quicktime" />
                <source src="/DemoImages/Video/PromotionVideo.mov" type="video/mp4" />
                브라우저가 비디오를 지원하지 않습니다.
            </video>
        </div>
    );
}
