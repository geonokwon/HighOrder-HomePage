'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration?: number; // 초 단위 (기본값: 24시간)
  className?: string;
  compact?: boolean; // 컴팩트 모드 추가
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  duration = 24 * 60 * 60, // 24시간을 초로
  className = "",
  compact = false
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // 매일 자정에 리셋되는 공통 타이머
    const calculateCommonTime = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const secondsSinceMidnight = Math.floor((now.getTime() - today.getTime()) / 1000);
      
      // duration 주기로 반복되는 카운트다운
      const cyclePosition = secondsSinceMidnight % duration;
      const remaining = duration - cyclePosition;
      
      return remaining;
    };

    // 초기 시간 설정
    setTimeLeft(calculateCommonTime());

    // 1초마다 업데이트
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // 0이 되면 바로 다시 duration으로 리셋
          return duration;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  // 시간을 시:분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  if (compact) {
    return (
      <div className={`text-center ${className}`}>
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-600">
            기간 내 신청 시 혜택
          </span>
        </div>
        
        <div className="flex justify-center items-center gap-1 mb-2">
          <div className="bg-orange-500 text-white rounded px-2 py-1 min-w-[40px]">
            <div className="text-sm font-bold">{hours}</div>
            <div className="text-xs">시</div>
          </div>
          <div className="text-sm font-bold text-orange-500">:</div>
          <div className="bg-orange-500 text-white rounded px-2 py-1 min-w-[40px]">
            <div className="text-sm font-bold">{minutes}</div>
            <div className="text-xs">분</div>
          </div>
          <div className="text-sm font-bold text-orange-500">:</div>
          <div className="bg-orange-500 text-white rounded px-2 py-1 min-w-[40px]">
            <div className="text-sm font-bold">{seconds}</div>
            <div className="text-xs">초</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          남은 시간 내 신청 시 <span className="font-bold text-orange-500">추가 혜택</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-600">
          기간 내 신청 시 받을 수 있는 혜택
        </span>
      </div>
      
      <div className="flex justify-center items-center gap-2 mb-4">
        <div className="bg-orange-500 text-white rounded-lg px-2 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{hours}</div>
          <div className="text-xs">시간</div>
        </div>
        <div className="text-2xl font-bold text-orange-500">:</div>
        <div className="bg-orange-500 text-white rounded-lg px-2 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{minutes}</div>
          <div className="text-xs">분</div>
        </div>
        <div className="text-2xl font-bold text-orange-500">:</div>
        <div className="bg-orange-500 text-white rounded-lg px-2 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{seconds}</div>
          <div className="text-xs">초</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        남은 시간 내 신청 시 <span className="font-bold text-orange-500">추가 혜택</span> 제공
      </div>
    </div>
  );
}; 