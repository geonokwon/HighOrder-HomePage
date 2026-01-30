"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateInventoryTurnover } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

const inputs: CalculatorInput[] = [
  {
    name: 'averageInventory',
    label: '평균 재고',
    type: 'currency',
    defaultValue: 5000000,
    min: 100000,
    unit: '원'
  },
  {
    name: 'costOfGoodsSold',
    label: '매출원가',
    type: 'currency',
    defaultValue: 20000000,
    min: 100000,
    unit: '원'
  },
  {
    name: 'holdingDays',
    label: '보유일수',
    type: 'number',
    defaultValue: 30,
    min: 1,
    max: 365,
    unit: '일'
  }
];

export const InventoryTurnoverCalculator: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({
    averageInventory: 5000000,
    costOfGoodsSold: 20000000,
    holdingDays: 30
  });

  const [results, setResults] = useState<CalculatorResult[]>([]);

  useEffect(() => {
    const calculation = calculateInventoryTurnover({
      averageInventory: values.averageInventory,
      costOfGoodsSold: values.costOfGoodsSold,
      holdingDays: values.holdingDays
    });

    setResults([
      {
        label: '재고 회전율',
        value: calculation.inventoryTurnover,
        unit: '회/년'
      },
      {
        label: '재고 보유일수',
        value: calculation.daysToSell,
        unit: '일'
      },
      {
        label: '보유 비용',
        value: calculation.holdingCost,
        format: 'currency'
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
          재고 회전율 및 비용 계산기
        </h1>
        <p className="text-gray-600">
          재고 효율성 측정, 불용재고 비용을 분석합니다
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
            <li>• <strong>소매업</strong>: 상품 재고 관리가 필요한 업체</li>
            <li>• <strong>제조업</strong>: 원자재 및 완제품 재고 관리가 필요한 업체</li>
            <li>• <strong>도매업</strong>: 대량 재고 관리가 필요한 업체</li>
            <li>• <strong>음식점/카페</strong>: 식자재 재고 관리가 필요한 업체</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>재고 회전율</strong>: 매출원가 ÷ 평균 재고</li>
            <li>• <strong>재고 보유일수</strong>: 365일 ÷ 재고 회전율</li>
            <li>• <strong>보유 비용</strong>: 평균 재고 × (보유일수 ÷ 365) × 10%</li>
            <li>• <strong>평균 재고</strong>: (기초재고 + 기말재고) ÷ 2</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 높은 재고 회전율은 효율적인 재고 관리를 의미합니다</li>
            <li>• 업종별로 적정 재고 회전율이 다를 수 있습니다</li>
            <li>• 계절성 상품의 경우 회전율이 달라질 수 있습니다</li>
            <li>• 이 계산기는 재고 관리 효율성 분석을 위한 참고용입니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 