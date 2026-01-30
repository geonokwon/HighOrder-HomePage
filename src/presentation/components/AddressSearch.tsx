'use client';

import React, { useEffect, useState } from 'react';

interface AddressSearchProps {
  onAddressSelect: (address: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    daum: any;
  }
}

export const AddressSearch: React.FC<AddressSearchProps> = ({ 
  onAddressSelect, 
  placeholder = "주소를 입력해주세요",
  className = "",
  value = "",
  disabled = false
}) => {
  const [address, setAddress] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // 다음 주소 API 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      console.error('주소 검색 스크립트 로드 실패');
      setIsScriptLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 스크립트가 로드되면 API 사용 가능 여부 확인
  useEffect(() => {
    if (isScriptLoaded && window.daum && window.daum.Postcode) {
      // Daum Postcode API가 정상적으로 로드됨
      console.log('Daum Postcode API 로드 완료');
    }
  }, [isScriptLoaded]);

  // value prop이 변경될 때 address state 업데이트
  useEffect(() => {
    setAddress(value);
  }, [value]);

  const handleAddressSearch = () => {
    if (disabled) return;
    
    if (!isScriptLoaded || !window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsSearching(true);

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setIsSearching(false);
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ' (' + extraAddress + ')' : '';
        }

        setAddress(fullAddress);
        onAddressSelect(fullAddress);
      },
      onclose: () => {
        setIsSearching(false);
      }
    }).open();
  };

  return (
    <div className={`flex ${className}`}>
      <input
        type="text"
        value={address}
        onChange={(e) => {
          if (disabled) return;
          setAddress(e.target.value);
          onAddressSelect(e.target.value);
        }}
        placeholder={placeholder}
        className="flex-1 min-w-0 p-3 text-base border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
        style={{
          WebkitAppearance: 'none',
          WebkitBorderRadius: '8px 0 0 8px',
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          borderRadius: '8px 0 0 8px'
        }}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleAddressSearch}
        disabled={isSearching || !isScriptLoaded || !window.daum?.Postcode || disabled}
        className="px-3 md:px-4 py-3 bg-orange-500 text-white font-medium rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0"
      >
        {!isScriptLoaded ? '로딩중...' : isSearching ? '검색중...' : <span className="hidden sm:inline">주소 찾기</span>}
        {!isScriptLoaded ? '' : isSearching ? '' : <span className="sm:hidden">찾기</span>}
      </button>
    </div>
  );
}; 