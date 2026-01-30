"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import { ResultCard } from '../../components/ResultCard';
import BannerRow from '../../components/BannerRow';
import { calculateSeverancePay } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

const baseInputs: CalculatorInput[] = [
  {
    name: 'yearsOfService',
    label: '근속년수',
    type: 'number',
    defaultValue: 3,
    min: 0,
    max: 50,
    unit: '년'
  },
  {
    name: 'monthsOfService',
    label: '근속개월수',
    type: 'number',
    defaultValue: 6,
    min: 0,
    max: 11,
    unit: '개월'
  }
];

export const SeverancePayCalculator: React.FC = () => {
  const [useAverageInput, setUseAverageInput] = useState<boolean>(true);
  const [values, setValues] = useState<Record<string, number>>({
    averageDailyWage: 50000,
    recentThreeMonthsTotal: 9000000,
    periodDays: 90,
    yearsOfService: 3,
    monthsOfService: 6
  });

  const [results, setResults] = useState<CalculatorResult[]>([]);

  useEffect(() => {
    const calculation = calculateSeverancePay({
      yearsOfService: values.yearsOfService,
      monthsOfService: values.monthsOfService,
      averageDailyWage: useAverageInput ? values.averageDailyWage : undefined,
      recentThreeMonthsTotal: !useAverageInput ? values.recentThreeMonthsTotal : undefined,
      periodDays: !useAverageInput ? values.periodDays : undefined
    });

    setResults([
      {
        label: '총 근무개월수',
        value: calculation.totalMonths,
        unit: '개월'
      },
      {
        label: '계산된 1일 평균임금',
        value: calculation.averageDailyWage,
        format: 'currency'
      },
      {
        label: '퇴직금',
        value: calculation.severancePay,
        format: 'currency'
      }
    ]);
  }, [values, useAverageInput]);

  const handleInputChange = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          퇴직금 계산기
        </h1>
        <p className="text-gray-600">평균임금 또는 최근 3개월 급여를 바탕으로 퇴직금을 계산합니다</p>
        <BannerRow />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">입력값</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`px-3 py-1 rounded border ${useAverageInput ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setUseAverageInput(true)}
              >
                1일 평균임금 직접 입력
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded border ${!useAverageInput ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setUseAverageInput(false)}
              >
                최근 3개월로 평균임금 계산
              </button>
            </div>

            {useAverageInput ? (
              <NumberInput
                input={{ name: 'averageDailyWage', label: '1일 평균임금', type: 'currency', defaultValue: 50000, min: 10000, unit: '원' }}
                value={values['averageDailyWage']}
                onChange={(value) => handleInputChange('averageDailyWage', value)}
              />
            ) : (
              <>
                <NumberInput
                  input={{ name: 'recentThreeMonthsTotal', label: '최근 3개월 총 급여', type: 'currency', defaultValue: 9000000, min: 0, unit: '원' }}
                  value={values['recentThreeMonthsTotal']}
                  onChange={(value) => handleInputChange('recentThreeMonthsTotal', value)}
                />
                <NumberInput
                  input={{ name: 'periodDays', label: '최근 3개월 기간 일수', type: 'number', defaultValue: 90, min: 1, unit: '일' }}
                  value={values['periodDays']}
                  onChange={(value) => handleInputChange('periodDays', value)}
                />
              </>
            )}

            {baseInputs.map((input) => (
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 계산 가정 및 지급대상</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📋 지급대상</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>1년 이상 근무자</strong>: 계속 근무기간이 1년 이상인 근로자</li>
            <li>• <strong>정규직/비정규직</strong>: 고용형태와 관계없이 적용</li>
            <li>• <strong>퇴직 사유</strong>: 자발적 퇴직, 계약 만료, 정리해고 등 모든 퇴직</li>
            <li>• <strong>예외 대상</strong>: 1년 미만 근무자는 퇴직금 지급 대상이 아닙니다</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>퇴직금 공식</strong>: 1일 평균임금 × 30일 × (근무개월수 ÷ 12)</li>
            <li>• <strong>평균임금 계산</strong>: 직접 입력하거나, 최근 3개월 총 급여 ÷ 해당 기간 일수로 자동 계산</li>
            <li>• <strong>근무기간</strong>: 년수와 개월수를 합산하여 계산합니다</li>
            <li>• <strong>급여 포함 항목</strong>: 기본급, 수당, 상여금 등 모든 급여 포함</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 실제 퇴직금은 근로계약서와 회사 규정에 따라 다를 수 있습니다</li>
            <li>• 퇴직연금제도 도입 시 퇴직금 대신 퇴직연금이 지급될 수 있습니다</li>
            <li>• 정확한 계산을 위해서는 근로감독관청이나 전문가와 상담하시기 바랍니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 