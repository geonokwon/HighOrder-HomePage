"use client";

interface WifiImageProps {
    onClose: () => void;
}

export default function WifiImage({ onClose }: WifiImageProps) {
    return (
        <div 
            className="w-full h-full bg-black flex items-center justify-center cursor-pointer"
            onClick={onClose}
        >
            <img 
                src="/DemoImages/HighOrder_Demo_Wifi_Image.png" 
                alt="와이파이 정보" 
                className="w-full h-full object-contain"
            />
        </div>
    );
}
