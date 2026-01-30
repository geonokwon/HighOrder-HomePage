// 천단위 콤마 포맷팅
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

// 통화 포맷팅 (원) - 원화는 소수점 없음
export const formatCurrency = (value: number): string => {
  return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`;
};

// 퍼센트 포맷팅
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// 퍼센트 포인트 포맷팅
export const formatPercentPoint = (value: number): string => {
  return `${value.toFixed(1)}%p`;
};

// 소수점 자릿수 제한
export const formatDecimal = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals);
};

// 단위별 포맷팅
export const formatWithUnit = (value: number, unit: string): string => {
  return `${formatNumber(value)}${unit}`;
}; 