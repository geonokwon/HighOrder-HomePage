"use client";

interface EventImageProps {
    onClose: () => void;
}

export default function EventImage({ onClose }: EventImageProps) {
    return (
        <div 
            className="w-full h-full bg-black flex items-center justify-center cursor-pointer"
            onClick={onClose}
        >
            <img 
                src="/DemoImages/HighOrder_Demo_Event_Image.png" 
                alt="이벤트 이미지" 
                className="w-full h-full object-contain"
            />
        </div>
    );
}
