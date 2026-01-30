"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateMarginPricing } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

// 세분화된 원가 입력을 위한 타입
interface CostItem {
  name: string;
  value: number;
}

export const MarginPricingCalculator: React.FC = () => {
  const [calculationMode, setCalculationMode] = useState<'margin' | 'price'>('margin');
  const [results, setResults] = useState<CalculatorResult[]>([]);

  // 세분화 입력 모드
  const [materialCosts, setMaterialCosts] = useState<CostItem[]>([
    { name: '재료비 1', value: 3000 },
    { name: '재료비 2', value: 2000 }
  ]);
  const [packagingCosts, setPackagingCosts] = useState<CostItem[]>([
    { name: '포장재', value: 500 }
  ]);
  const [laborCosts, setLaborCosts] = useState<CostItem[]>([
    { name: '인건비', value: 1500 }
  ]);
  const [overheadCosts, setOverheadCosts] = useState<CostItem[]>([
    { name: '간접비', value: 1000 }
  ]);
  const [values, setValues] = useState<Record<string, number>>({
    targetMargin: 30,
    sellingPrice: 12000
  });

  useEffect(() => {
    let calculation;
    
    // 세분화 입력 모드
    const materialCostsObj = materialCosts.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {} as Record<string, number>);
    
    const packagingCostsObj = packagingCosts.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {} as Record<string, number>);
    
    const laborCostsObj = laborCosts.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {} as Record<string, number>);
    
    const overheadCostsObj = overheadCosts.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {} as Record<string, number>);

    if (calculationMode === 'margin') {
      calculation = calculateMarginPricing({
        materialCosts: materialCostsObj,
        packagingCosts: packagingCostsObj,
        laborCosts: laborCostsObj,
        overheadCosts: overheadCostsObj,
        sellingPrice: values.sellingPrice
      });
    } else {
      calculation = calculateMarginPricing({
        materialCosts: materialCostsObj,
        packagingCosts: packagingCostsObj,
        laborCosts: laborCostsObj,
        overheadCosts: overheadCostsObj,
        targetMargin: values.targetMargin
      });
    }

    setResults([
      {
        label: '총 원가',
        value: calculation.totalCost,
        format: 'currency'
      },
      {
        label: '판매가',
        value: calculation.sellingPrice,
        format: 'currency'
      },
      {
        label: '마진율',
        value: calculation.margin,
        format: 'percent'
      },
      {
        label: '이익',
        value: calculation.profit,
        format: 'currency'
      }
    ]);
  }, [calculationMode, values, materialCosts, packagingCosts, laborCosts, overheadCosts]);

  const handleInputChange = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleCostItemChange = (
    category: 'material' | 'packaging' | 'labor' | 'overhead',
    index: number,
    field: 'name' | 'value',
    value: string | number
  ) => {
    const setterMap = {
      material: setMaterialCosts,
      packaging: setPackagingCosts,
      labor: setLaborCosts,
      overhead: setOverheadCosts
    };

    const setter = setterMap[category];
    setter(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addCostItem = (category: 'material' | 'packaging' | 'labor' | 'overhead') => {
    const setterMap = {
      material: setMaterialCosts,
      packaging: setPackagingCosts,
      labor: setLaborCosts,
      overhead: setOverheadCosts
    };

    const nameMap = {
      material: '재료비',
      packaging: '포장재',
      labor: '인건비',
      overhead: '간접비'
    };

    const setter = setterMap[category];
    const baseName = nameMap[category];
    
    setter(prev => [...prev, { name: `${baseName} ${prev.length + 1}`, value: 0 }]);
  };

  const removeCostItem = (
    category: 'material' | 'packaging' | 'labor' | 'overhead',
    index: number
  ) => {
    const setterMap = {
      material: setMaterialCosts,
      packaging: setPackagingCosts,
      labor: setLaborCosts,
      overhead: setOverheadCosts
    };

    const setter = setterMap[category];
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          마진율 및 가격 책정 계산기
        </h1>
        <p className="text-gray-600">
          세분화된 원가 분석을 통한 정확한 마진 계산
        </p>
        <BannerRow />
      </div>

      {/* 계산 모드 선택 */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setCalculationMode('margin')}
          className={`px-4 py-2 rounded-lg font-medium ${
            calculationMode === 'margin'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          마진율 계산
        </button>
        <button
          onClick={() => setCalculationMode('price')}
          className={`px-4 py-2 rounded-lg font-medium ${
            calculationMode === 'price'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          판매가 계산
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">입력값</h2>
          
          <div className="space-y-6">
              {/* 재료비 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">재료비</h3>
                  <button
                    onClick={() => addCostItem('material')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    + 항목추가
                  </button>
                </div>
                {materialCosts.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleCostItemChange('material', index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="재료명"
                    />
                    <input
                      type="number"
                      value={item.value || ''}
                      onChange={(e) => handleCostItemChange('material', index, 'value', Number(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border rounded text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="금액"
                    />
                    <button
                      onClick={() => removeCostItem('material', index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 포장재 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">포장재</h3>
                  <button
                    onClick={() => addCostItem('packaging')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    + 항목추가
                  </button>
                </div>
                {packagingCosts.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleCostItemChange('packaging', index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="포장재명"
                    />
                    <input
                      type="number"
                      value={item.value || ''}
                      onChange={(e) => handleCostItemChange('packaging', index, 'value', Number(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border rounded text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="금액"
                    />
                    <button
                      onClick={() => removeCostItem('packaging', index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 인건비 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">인건비</h3>
                  <button
                    onClick={() => addCostItem('labor')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    + 항목추가
                  </button>
                </div>
                {laborCosts.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleCostItemChange('labor', index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="인건비 항목"
                    />
                    <input
                      type="number"
                      value={item.value || ''}
                      onChange={(e) => handleCostItemChange('labor', index, 'value', Number(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border rounded text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="금액"
                    />
                    <button
                      onClick={() => removeCostItem('labor', index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 간접비 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">간접비</h3>
                  <button
                    onClick={() => addCostItem('overhead')}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    + 항목추가
                  </button>
                </div>
                {overheadCosts.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleCostItemChange('overhead', index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="간접비 항목"
                    />
                    <input
                      type="number"
                      value={item.value || ''}
                      onChange={(e) => handleCostItemChange('overhead', index, 'value', Number(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border rounded text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="금액"
                    />
                    <button
                      onClick={() => removeCostItem('overhead', index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 판매가/마진율 입력 */}
              {calculationMode === 'margin' ? (
                <NumberInput
                  input={{
                    name: 'sellingPrice',
                    label: '판매가',
                    type: 'currency',
                    defaultValue: 12000,
                    min: 1000,
                    unit: '원'
                  }}
                  value={values.sellingPrice}
                  onChange={(value) => handleInputChange('sellingPrice', value)}
                />
              ) : (
                <NumberInput
                  input={{
                    name: 'targetMargin',
                    label: '목표 마진율',
                    type: 'percent',
                    defaultValue: 30,
                    min: 0,
                    max: 100,
                    unit: '%'
                  }}
                  value={values.targetMargin}
                  onChange={(value) => handleInputChange('targetMargin', value)}
                />
              )}
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
            <li>• <strong>소매업</strong>: 상품 판매를 통한 마진 관리가 필요한 업체</li>
            <li>• <strong>음식점/카페</strong>: 메뉴 가격 책정이 필요한 업체</li>
            <li>• <strong>제조업</strong>: 제품 가격 정책 수립이 필요한 업체</li>
            <li>• <strong>서비스업</strong>: 서비스 요금 책정이 필요한 업체</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>총 원가</strong>: 재료비 + 포장재 + 인건비 + 간접비</li>
            <li>• <strong>마진율</strong>: (판매가 - 총 원가) ÷ 판매가 × 100</li>
            <li>• <strong>판매가 계산</strong>: 총 원가 ÷ (1 - 마진율 ÷ 100)</li>
            <li>• <strong>이익</strong>: 판매가 - 총 원가</li>
            <li>• <strong>세분화 원가</strong>: 각 항목별로 세부 원가를 입력하여 정확한 계산</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 실제 마진은 세금, 수수료, 간접비 등을 고려하여 달라질 수 있습니다</li>
            <li>• 시장 가격, 경쟁 상황, 고객 수용성 등을 종합적으로 고려해야 합니다</li>
            <li>• 이 계산기는 기본적인 가격 책정을 위한 참고용입니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 