"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import { ResultCard } from '../../components/ResultCard';
import { calculateIncomeTax, IncomeExpenseMethod } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';
import BannerRow from '../../components/BannerRow';

const baseInputs: CalculatorInput[] = [
  {
    name: 'revenue',
    label: '매출액(수입금액, 1년)',
    type: 'currency',
    defaultValue: 50_000_000,
    min: 1_000_000,
    unit: '원'
  },
  {
    name: 'dependents',
    label: '부양가족 수',
    type: 'number',
    defaultValue: 1,
    min: 0,
    max: 10,
    unit: '명'
  },
  {
    name: 'deductions',
    label: '공제 합계',
    type: 'currency',
    defaultValue: 2_000_000,
    min: 0,
    unit: '원'
  }
];

export const IncomeTaxCalculator: React.FC = () => {
  const [method, setMethod] = useState<IncomeExpenseMethod>('simple');

  const [values, setValues] = useState<Record<string, number>>({
    revenue: 50_000_000,
    expenseRate: 20,
    purchases: 0,
    otherExpenses: 0,
    dependents: 1,
    deductions: 2_000_000,
    parentsCount: 0,
    childrenCount: 0,
    disabledCount: 0,
    otherDependentsCount: 0
  });
  const [flags, setFlags] = useState<{ spouseEligible: boolean; useStandardTaxCredit: boolean; useElectronicFilingCredit: boolean; applyChildTaxCredit: boolean }>({
    spouseEligible: false,
    useStandardTaxCredit: true,
    useElectronicFilingCredit: false,
    applyChildTaxCredit: true
  });

  const [results, setResults] = useState<CalculatorResult[]>([]);

  useEffect(() => {
    const calc = calculateIncomeTax({
      method,
      revenue: values.revenue,
      expenseRate: method !== 'actual' ? values.expenseRate : undefined,
      purchases: method === 'actual' ? values.purchases : 0,
      otherExpenses: method === 'actual' ? values.otherExpenses : 0,
      dependents: values.dependents,
      deductions: values.deductions,
      spouseEligible: flags.spouseEligible,
      parentsCount: values.parentsCount,
      childrenCount: values.childrenCount,
      disabledCount: values.disabledCount,
      otherDependentsCount: values.otherDependentsCount,
      useStandardTaxCredit: flags.useStandardTaxCredit,
      useElectronicFilingCredit: flags.useElectronicFilingCredit,
      applyChildTaxCredit: flags.applyChildTaxCredit
    });

    setResults([
      { label: '필요경비', value: calc.necessaryExpenses, format: 'currency' },
      {
        label: '과세표준',
        value: calc.taxableIncome,
        format: 'currency'
      },
      {
        label: '최종과세표준',
        value: calc.finalTaxableIncome,
        format: 'currency'
      },
      { label: '기본공제 인원', value: calc.basicDeductionCount, format: 'number' },
      { label: '기본공제 합계', value: calc.basicDeductionAmount, format: 'currency' },
      { label: '누진공제액', value: calc.progressiveDeduction, format: 'currency' },
      {
        label: '세율',
        value: calc.taxRate,
        format: 'percent'
      },
      { label: '세액공제 합계', value: calc.taxCredits, format: 'currency' },
      { label: '국세(소득세)', value: calc.nationalIncomeTax, format: 'currency' },
      { label: '지방소득세', value: calc.localIncomeTax, format: 'currency' },
      { label: '총 납부세액', value: calc.totalPayable, format: 'currency' }
    ]);
  }, [method, values, flags]);

  const handleInputChange = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };
  const toggleFlag = (name: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          종합소득세 예상 계산기
        </h1>
        <p className="text-gray-600">
          매출액과 경비 산정 방식에 따라 예시 세액을 계산합니다
        </p>
        <BannerRow />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">입력값</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">경비 방식:</span>
              <button
                type="button"
                className={`px-3 py-1 rounded border text-xs md:text-sm ${method === 'simple' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setMethod('simple')}
              >
                단순경비율
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded border text-xs md:text-sm ${method === 'standard' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setMethod('standard')}
              >
                기준경비율
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded border text-xs md:text-sm ${method === 'actual' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setMethod('actual')}
              >
                실제경비(장부)
              </button>
            </div>

            {baseInputs.map((input) => (
              <NumberInput
                key={input.name}
                input={input}
                value={values[input.name]}
                onChange={(value) => handleInputChange(input.name, value)}
              />
            ))}

            {/* 인적공제 상세 입력 */}
            <p className="text-xs text-gray-500">아래 항목은 누르면 적용/해제됩니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                aria-pressed={flags.spouseEligible}
                className={`px-3 py-2 rounded border text-left ${flags.spouseEligible ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => toggleFlag('spouseEligible')}
              >
                배우자 기본공제 해당
              </button>
              <button
                type="button"
                aria-pressed={flags.useStandardTaxCredit}
                className={`px-3 py-2 rounded border text-left ${flags.useStandardTaxCredit ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => toggleFlag('useStandardTaxCredit')}
              >
                표준세액공제 적용(70,000원)
              </button>
              <button
                type="button"
                aria-pressed={flags.useElectronicFilingCredit}
                className={`px-3 py-2 rounded border text-left ${flags.useElectronicFilingCredit ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => toggleFlag('useElectronicFilingCredit')}
              >
                전자신고세액공제 적용(20,000원)
              </button>
              <button
                type="button"
                aria-pressed={flags.applyChildTaxCredit}
                className={`px-3 py-2 rounded border text-left ${flags.applyChildTaxCredit ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => toggleFlag('applyChildTaxCredit')}
              >
                자녀세액공제 적용
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                input={{ name: 'parentsCount', label: '부모 등 직계존속 수', type: 'number', defaultValue: 0, min: 0, unit: '명' }}
                value={values['parentsCount']}
                onChange={(value) => handleInputChange('parentsCount', value)}
              />
              <NumberInput
                input={{ name: 'childrenCount', label: '자녀 수', type: 'number', defaultValue: 0, min: 0, unit: '명' }}
                value={values['childrenCount']}
                onChange={(value) => handleInputChange('childrenCount', value)}
              />
              <NumberInput
                input={{ name: 'disabledCount', label: '장애인 수', type: 'number', defaultValue: 0, min: 0, unit: '명' }}
                value={values['disabledCount']}
                onChange={(value) => handleInputChange('disabledCount', value)}
              />
              <NumberInput
                input={{ name: 'otherDependentsCount', label: '기타 부양가족 수', type: 'number', defaultValue: 0, min: 0, unit: '명' }}
                value={values['otherDependentsCount']}
                onChange={(value) => handleInputChange('otherDependentsCount', value)}
              />
            </div>



            {method !== 'actual' ? (
              <NumberInput
                input={{ name: 'expenseRate', label: `${method === 'simple' ? '단순경비율' : '기준경비율'}(%)`, type: 'percent', defaultValue: 20, min: 0, max: 100, unit: '%' }}
                value={values['expenseRate']}
                onChange={(value) => handleInputChange('expenseRate', value)}
              />
            ) : (
              <>
                <NumberInput
                  input={{ name: 'purchases', label: '매입/재료비(세금계산서 등)', type: 'currency', defaultValue: 0, min: 0, unit: '원' }}
                  value={values['purchases']}
                  onChange={(value) => handleInputChange('purchases', value)}
                />
                <NumberInput
                  input={{ name: 'otherExpenses', label: '기타 필요경비(임차료, 인건비 등)', type: 'currency', defaultValue: 0, min: 0, unit: '원' }}
                  value={values['otherExpenses']}
                  onChange={(value) => handleInputChange('otherExpenses', value)}
                />
              </>
            )}
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
            <li>• <strong>개인사업자</strong>: 개인사업자 소득세 신고 대상자</li>
            <li>• <strong>프리랜서</strong>: 개별적으로 소득세를 신고하는 프리랜서</li>
            <li>• <strong>소규모 사업자</strong>: 연 매출 8,000만원 미만 간이과세자</li>
            <li>• <strong>일반 사업자</strong>: 연 매출 8,000만원 이상 일반과세자</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>매출액</strong>: 수입금액을 입력합니다. 매입액은 실제경비 방식에서만 별도 입력</li>
            <li>• <strong>경비율</strong>: 단순/기준경비율은 업종·규모에 따라 다르며, 실제율과 다를 수 있음</li>
            <li>• <strong>기본공제</strong>: 본인 1인 포함, 배우자/부모/자녀/장애인/기타 부양가족 추가 가능</li>
            <li>• <strong>세액공제</strong>: 표준세액공제(70,000원), 전자신고세액공제(20,000원), 자녀세액공제 반영</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 본 계산기는 간이 예시이며 실제 신고·납부세액과 차이가 있을 수 있습니다</li>
            <li>• 정확한 세액 계산을 위해서는 세무사나 국세청에 문의하시기 바랍니다</li>
            <li>• 세법 개정에 따라 계산 방식이 변경될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 