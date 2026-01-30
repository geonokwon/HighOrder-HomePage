"use client";
import React, { useState, useEffect } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateWeeklyHolidayPay } from '../../utils/calculations';
import { CalculatorInput, CalculatorResult } from '../../types/calculator';

const inputs: CalculatorInput[] = [
  {
    name: 'hourlyWage',
    label: '시급',
    type: 'currency',
    defaultValue: 11000,
    min: 1000,
    unit: '원'
  },
  {
    name: 'weeklyWorkDays',
    label: '주 근무일수',
    type: 'number',
    defaultValue: 5,
    min: 1,
    max: 7,
    unit: '일'
  },
  {
    name: 'dailyWorkHours',
    label: '1일 근무시간',
    type: 'number',
    defaultValue: 8,
    min: 1,
    max: 24,
    unit: '시간'
  }
];

export const WeeklyHolidayPayCalculator: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({
    hourlyWage: 11000,
    weeklyWorkDays: 5,
    dailyWorkHours: 8
  });

  const [results, setResults] = useState<CalculatorResult[]>([]);

  useEffect(() => {
    const calculation = calculateWeeklyHolidayPay({
      hourlyWage: values.hourlyWage,
      weeklyWorkDays: values.weeklyWorkDays,
      dailyWorkHours: values.dailyWorkHours
    });

    setResults([
      {
        label: '주 근무시간',
        value: calculation.weeklyWorkHours,
        unit: '시간'
      },
      {
        label: '주휴수당 지급 여부',
        value: 0,
        unit: calculation.isEligibleForHolidayPay ? '지급' : '미지급',
        format: 'text'
      },
      {
        label: '주휴수당',
        value: calculation.weeklyHolidayPay,
        format: 'currency'
      },
      {
        label: '월 주휴수당',
        value: calculation.monthlyHolidayPay,
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
          주휴수당 계산기
        </h1>
        <p className="text-gray-600">
          주당 근무시간을 기준으로 주휴수당을 계산해보세요
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 계산 가정 및 지급대상</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📋 지급대상</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>주 15시간 이상 근무자</strong>: 주 평균 근무시간이 15시간 이상인 근로자</li>
            <li>• <strong>정규직/비정규직</strong>: 고용형태와 관계없이 적용</li>
            <li>• <strong>파트타임 근로자</strong>: 주 15시간 이상 근무하는 파트타임 근로자</li>
            <li>• <strong>학생 아르바이트</strong>: 주 15시간 이상 근무하는 학생도 포함</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>지급 기준</strong>: 주 15시간 이상 근무 시 지급됩니다</li>
            <li>• <strong>주휴수당 계산</strong>: 시급 × 1일 소정근로시간으로 계산됩니다</li>
            <li>• <strong>월 주휴수당</strong>: 주휴수당 × 4.345주로 계산됩니다</li>
            <li>• <strong>4.345주</strong>: 연간 52주를 12개월로 나눈 평균값입니다</li>
            <li>• <strong>2025년 최저임금 기준</strong>: 9,860원 (8시간 근무 시 78,880원, 9시간 근무 시 88,740원)</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📅 지급 조건 (2025년 기준)</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>주당 15시간 이상 근무</strong>: 4주 평균 하루 15시간 이상 근무한 근로자</li>
            <li>• <strong>소정 근로일의 개근</strong>: 근로계약서에 명시된 소정의 근로일에 모두 출근해야 함</li>
            <li>• <strong>개근 조건</strong>: 지각, 조퇴, 결근 없이 출근해야 주휴수당 발생</li>
            <li>• <strong>정당한 사유</strong>: 병가, 공가, 산전후휴가 등은 개근으로 인정</li>
            <li>• <strong>주 단위 계산</strong>: 매주 개별적으로 계산하여 지급 여부 결정</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 주 15시간 미만 근무자는 주휴수당 지급 대상이 아닙니다</li>
            <li>• 소정 근로일에 개근하지 않은 주에는 주휴수당이 지급되지 않습니다</li>
            <li>• 실제 지급액은 근로계약서와 회사 규정에 따라 다를 수 있습니다</li>
            <li>• 정확한 계산을 위해서는 근로감독관청이나 전문가와 상담하시기 바랍니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 