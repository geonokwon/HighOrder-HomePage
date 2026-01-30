"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateInsurance } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

const inputs: CalculatorInput[] = [
  {
    name: 'monthlySalary',
    label: '월급',
    type: 'currency',
    defaultValue: 3000000,
    min: 100000,
    unit: '원'
  }
];

export const InsuranceCalculator: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({
    monthlySalary: 3000000,
    weeklyWorkDays: 5,
    dailyWorkHours: 8,
    monthsWorked: 1,
  });

  const [employeeType, setEmployeeType] = useState<'regular' | 'partTime'>('regular');
  const [hasDependents, setHasDependents] = useState(false);
  const [results, setResults] = useState<CalculatorResult[]>([]);


  useEffect(() => {
    const calculation = calculateInsurance({
      monthlySalary: values.monthlySalary,
      employeeType,
      hasDependents,
      weeklyWorkDays: values.weeklyWorkDays,
      dailyWorkHours: values.dailyWorkHours,
      monthsWorked: values.monthsWorked,
    });

    setResults([
      { label: '주 근무시간', value: calculation.weeklyWorkHours, unit: '시간' },
      { label: '건강보험료', value: calculation.healthInsurance, format: 'currency', description: calculation.applies.health ? undefined : '의무 가입 아님' },
      {
        label: '국민연금',
        value: calculation.nationalPension,
        format: 'currency'
      },
      {
        label: '고용보험료',
        value: calculation.employmentInsurance,
        format: 'currency'
      },
      {
        label: '산재보험료(근로자부담)',
        value: calculation.industrialAccidentInsurance,
        format: 'currency'
      },
      {
        label: '총 보험료',
        value: calculation.totalInsurance,
        format: 'currency'
      }
    ]);
  }, [values, employeeType, hasDependents]);

  const handleInputChange = (name: string, value: number) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          4대보험료 계산기
        </h1>
        <p className="text-gray-600">
          사업주/직원 부담금을 계산합니다
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

            {/* 근로시간/개월수 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberInput
                input={{ name: 'weeklyWorkDays', label: '주 근무일수', type: 'number', defaultValue: 5, min: 1, max: 7, unit: '일' }}
                value={values['weeklyWorkDays']}
                onChange={(value) => handleInputChange('weeklyWorkDays', value)}
              />
              <NumberInput
                input={{ name: 'dailyWorkHours', label: '1일 근무시간', type: 'number', defaultValue: 8, min: 1, max: 24, unit: '시간' }}
                value={values['dailyWorkHours']}
                onChange={(value) => handleInputChange('dailyWorkHours', value)}
              />
              <NumberInput
                input={{ name: 'monthsWorked', label: '근무 개월수', type: 'number', defaultValue: 1, min: 0, max: 36, unit: '개월' }}
                value={values['monthsWorked']}
                onChange={(value) => handleInputChange('monthsWorked', value)}
              />
            </div>
            
            {/* 근로형태 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                근로형태
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeType"
                    checked={employeeType === 'regular'}
                    onChange={() => setEmployeeType('regular')}
                    className="mr-2"
                  />
                  정규직
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeType"
                    checked={employeeType === 'partTime'}
                    onChange={() => setEmployeeType('partTime')}
                    className="mr-2"
                  />
                  파트타임
                </label>
              </div>
            </div>

            {/* 부양가족 여부 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                부양가족 여부
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasDependents"
                    checked={hasDependents}
                    onChange={() => setHasDependents(true)}
                    className="mr-2"
                  />
                  있음
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasDependents"
                    checked={!hasDependents}
                    onChange={() => setHasDependents(false)}
                    className="mr-2"
                  />
                  없음
                </label>
              </div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 계산 가정 및 가입대상</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📋 가입대상</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>건강보험</strong>: 주 15시간 이상 근무 또는 월 소득 122만원 이상인 근로자</li>
            <li>• <strong>국민연금</strong>: 주 15시간 이상 근무하는 근로자 (임의가입 가능)</li>
            <li>• <strong>고용보험</strong>: 주 15시간 이상 근무하는 근로자 (3개월 경과 시점부터)</li>
            <li>• <strong>산재보험</strong>: 모든 근로자 (근로시간 무관)</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>건강보험</strong>: 주 15시간 미만 & 월 소득 약 122만원 미만이면 직장가입 의무 없음</li>
            <li>• <strong>국민연금</strong>: 주 15시간 미만이면 의무 가입 없음(임의가입 가능)</li>
            <li>• <strong>고용보험</strong>: 주 15시간 미만 + 3개월 미만 근무는 의무 없음(3개월 경과 시점부터 적용)</li>
            <li>• <strong>산재보험</strong>: 근로시간 무관, 근로자 부담 0(사업주 전액)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 실제 보험료는 복잡한 규정이 적용될 수 있습니다</li>
            <li>• 부양가족 수, 소득 수준 등에 따라 보험료가 달라질 수 있습니다</li>
            <li>• 정확한 계산을 위해서는 국민연금공단이나 건강보험공단에 문의하시기 바랍니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 