"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateVAT } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

const inputs: CalculatorInput[] = [
  {
    name: 'totalSales',
    label: '총매출',
    type: 'currency',
    defaultValue: 100000000,
    min: 1000000,
    unit: '원'
  },
  {
    name: 'totalPurchases',
    label: '총매입',
    type: 'currency',
    defaultValue: 60000000,
    min: 0,
    unit: '원'
  },
  {
    name: 'creditCardSales',
    label: '신용카드 매출',
    type: 'currency',
    defaultValue: 50000000,
    min: 0,
    unit: '원'
  },
  {
    name: 'cashReceiptSales',
    label: '현금영수증 매출',
    type: 'currency',
    defaultValue: 20000000,
    min: 0,
    unit: '원'
  }
];

export const VATCalculator: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({
    totalSales: 100000000,
    totalPurchases: 60000000,
    creditCardSales: 50000000,
    cashReceiptSales: 20000000
  });

  const [hasTaxInvoice, setHasTaxInvoice] = useState(true);
  const [results, setResults] = useState<CalculatorResult[]>([]);

  useEffect(() => {
    const calculation = calculateVAT({
      totalSales: values.totalSales,
      totalPurchases: values.totalPurchases,
      hasTaxInvoice,
      creditCardSales: values.creditCardSales,
      cashReceiptSales: values.cashReceiptSales
    });

    setResults([
      {
        label: '매출 부가세',
        value: calculation.salesVAT,
        format: 'currency'
      },
      {
        label: '매입 부가세',
        value: calculation.purchaseVAT,
        format: 'currency'
      },
      {
        label: '신용카드 공제액',
        value: calculation.cardSalesDeduction,
        format: 'currency',
        description: '신용카드/현금영수증 매출의 1.3% (한도 1,000만원)'
      },
      {
        label: '납부할 부가세',
        value: calculation.payableVAT,
        format: 'currency'
      }
    ]);
  }, [values, hasTaxInvoice]);

  const handleInputChange = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          부가가치세 예상 계산기
        </h1>
        <p className="text-gray-600">
          매출·매입 비교를 통한 부가세를 계산합니다
        </p>
        <BannerRow />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">입력값</h2>
          <div className="space-y-6">
            {/* 기본 매출/매입 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">📊 기본 매출/매입 정보</h3>
              <div className="space-y-4">
                <NumberInput
                  input={inputs[0]} // 총매출
                  value={values.totalSales}
                  onChange={(value) => handleInputChange('totalSales', value)}
                />
                <NumberInput
                  input={inputs[1]} // 총매입
                  value={values.totalPurchases}
                  onChange={(value) => handleInputChange('totalPurchases', value)}
                />
              </div>
            </div>

            {/* 신용카드/현금영수증 매출 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">💳 신용카드/현금영수증 매출</h3>
              <p className="text-sm text-gray-600 mb-4">
                신용카드나 현금영수증으로 결제한 매출액을 입력하세요. 
                <span className="font-medium text-blue-600"> 1.3% 공제 혜택</span>을 받을 수 있습니다.
              </p>
              <div className="space-y-4">
                <NumberInput
                  input={inputs[2]} // 신용카드 매출
                  value={values.creditCardSales}
                  onChange={(value) => handleInputChange('creditCardSales', value)}
                />
                <NumberInput
                  input={inputs[3]} // 현금영수증 매출
                  value={values.cashReceiptSales}
                  onChange={(value) => handleInputChange('cashReceiptSales', value)}
                />
              </div>
            </div>
            
            {/* 세금계산서 발급 여부 */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">📋 세금계산서 발급 여부</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="taxInvoice"
                    checked={hasTaxInvoice}
                    onChange={() => setHasTaxInvoice(true)}
                    className="mr-2"
                  />
                  발급함
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="taxInvoice"
                    checked={!hasTaxInvoice}
                    onChange={() => setHasTaxInvoice(false)}
                    className="mr-2"
                  />
                  발급하지 않음
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                세금계산서를 발급하면 매입 부가세를 공제받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 결과 섹션 */}
        <div className="flex flex-col">
          <div className="h-8"></div>
            <ResultCard results={results} />
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 계산 가정 및 적용대상</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📋 적용대상</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>사업자</strong>: 부가가치세 과세대상 사업자</li>
            <li>• <strong>간이과세자</strong>: 연 매출 8,000만원 미만 사업자 (간이과세율 적용)</li>
            <li>• <strong>일반과세자</strong>: 연 매출 8,000만원 이상 사업자 (10% 세율 적용)</li>
            <li>• <strong>면세사업자</strong>: 부가가치세 면세 대상 사업자</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>매출 부가세</strong>: 총매출 × 10% (일반과세자 기준)</li>
            <li>• <strong>매입 부가세</strong>: 총매입 × 10% (세금계산서 발급 시)</li>
            <li>• <strong>신용카드 공제</strong>: (신용카드 + 현금영수증) 매출 × 1.3% (한도 1,000만원)</li>
            <li>• <strong>납부할 부가세</strong>: 매출 부가세 - 매입 부가세 - 신용카드 공제액</li>
            <li>• <strong>간이과세율</strong>: 업종별로 0.5%~3% 적용 (연 매출 8,000만원 미만)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• <strong>신용카드 공제</strong>: 신용카드/현금영수증 매출의 1.3% 공제 (연간 한도 1,000만원)</li>
            <li>• <strong>세금계산서</strong>: 매입 시 세금계산서를 받아야 매입 부가세 공제 가능</li>
            <li>• 실제 부가가치세는 복잡한 규정이 적용될 수 있습니다</li>
            <li>• 면세사업, 영세율 적용 등 예외 사항이 있을 수 있습니다</li>
            <li>• 정확한 계산을 위해서는 세무사나 국세청에 문의하시기 바랍니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 