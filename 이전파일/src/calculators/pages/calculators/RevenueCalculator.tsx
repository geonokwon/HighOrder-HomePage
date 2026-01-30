"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateRevenueIncrease } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

const inputs: CalculatorInput[] = [
  {
    name: 'visitors',
    label: '일 방문객 수',
    type: 'number',
    defaultValue: 200,
    min: 1,
    unit: '명'
  },
  {
    name: 'currentConversionRate',
    label: '현재 구매전환율',
    type: 'percent',
    defaultValue: 35,
    min: 0,
    max: 100,
    unit: '%'
  },
  {
    name: 'conversionRateChange',
    label: '전환율 변화',
    type: 'percent',
    defaultValue: 5,
    min: -50,
    max: 50,
    unit: '%p'
  },
  {
    name: 'averageOrderValue',
    label: '객단가',
    type: 'currency',
    defaultValue: 12000,
    min: 1000,
    unit: '원'
  }
];

export const RevenueCalculator: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({
    visitors: 200,
    currentConversionRate: 35,
    conversionRateChange: 5,
    averageOrderValue: 12000
  });

  const [results, setResults] = useState<CalculatorResult[]>([]);

  useEffect(() => {
    const calculation = calculateRevenueIncrease({
      visitors: values.visitors,
      currentConversionRate: values.currentConversionRate,
      conversionRateChange: values.conversionRateChange,
      averageOrderValue: values.averageOrderValue
    });

    setResults([
      {
        label: '일 매출 증가액',
        value: calculation.revenueIncrease,
        format: 'currency'
      },
      {
        label: '월 매출 증가액',
        value: calculation.monthlyRevenueIncrease,
        format: 'currency'
      },
      {
        label: '매출 증가율',
        value: calculation.revenueIncreasePercent,
        format: 'percent'
      }
    ]);
  }, [values]);

  const handleInputChange = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          매출 증가 추정 계산기
        </h1>
        <p className="text-gray-600">
          테이블오더 도입 시 전환율 개선으로 인한 매출 증가를 계산해보세요
        </p>
        <BannerRow />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">입력값</h2>
          <div className="space-y-6">
            {inputs.map((input) => (
              <NumberInput
                key={input.name}
                input={input}
                value={values[input.name]}
                onChange={(value) => handleInputChange(input.name, value)}
              />
            ))}
          </div>
        </div>

        {/* 결과 섹션 */}
        <div className="flex flex-col">
          <div className="h-8"></div> {/* 입력값 제목과 같은 높이의 여백 */}
          <ResultCard results={results} />
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 계산 가정 및 적용대상</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📋 적용대상</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>음식점</strong>: 테이블오더 시스템 도입을 고려하는 음식점</li>
            <li>• <strong>카페/베이커리</strong>: 주문 시스템 개선을 원하는 업체</li>
            <li>• <strong>소매업</strong>: 고객 경험 개선을 통한 매출 증대를 원하는 업체</li>
            <li>• <strong>서비스업</strong>: 디지털 전환을 통한 효율성 증대를 원하는 업체</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>전환율</strong>: 방문객 중 실제 구매한 비율을 의미합니다</li>
            <li>• <strong>전환율 변화</strong>: 퍼센트 포인트(%p) 단위로 입력하세요</li>
            <li>• <strong>월 매출</strong>: 일 매출 × 30일로 계산됩니다</li>
            <li>• <strong>평균 주문 금액</strong>: 고객 1인당 평균 구매 금액입니다</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 실제 매장 상황에 따라 결과가 달라질 수 있습니다</li>
            <li>• 계절성, 마케팅 활동, 경쟁 상황 등 외부 요인을 고려해야 합니다</li>
            <li>• 이 계산기는 참고용이며, 실제 투자 결정은 전문가와 상담하시기 바랍니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 