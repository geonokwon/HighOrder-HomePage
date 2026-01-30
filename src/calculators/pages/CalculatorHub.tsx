"use client";
import React, { useState } from 'react';
import { CalculatorCard } from '../components/CalculatorCard';
import BannerRow from '../components/BannerRow';
import { Calculator } from '../types/calculator';

// 계산기 목록 정의
const calculators: Calculator[] = [
  {
    id: 'weekly-holiday-pay',
    slug: 'weekly-holiday-pay',
    title: '주휴수당 계산기',
    description: '주당 근무시간을 기준으로 주휴수당을 계산합니다',
    icon: '📅',
    category: 'cost',
    isAvailable: true,
    component: () => <div>Weekly Holiday Pay Calculator</div>
  },
  {
    id: 'minimum-wage-labor',
    slug: 'minimum-wage-labor',
    title: '최저임금 기준 인건비 계산기',
    description: '월 총 인건비를 자동으로 산정합니다',
    icon: '💰',
    category: 'cost',
    isAvailable: true,
    component: () => <div>Minimum Wage Labor Calculator</div>
  },
  {
    id: 'severance-pay',
    slug: 'severance-pay',
    title: '퇴직금 계산기',
    description: '평균임금 기준 퇴직금을 자동 계산합니다',
    icon: '👋',
    category: 'cost',
    isAvailable: true,
    component: () => <div>Severance Pay Calculator</div>
  },
  {
    id: 'break-even',
    slug: 'break-even',
    title: '손익분기점 계산기',
    description: '매출·비용 대비 손익분기점을 분석합니다',
    icon: '⚖️',
    category: 'revenue',
    isAvailable: true,
    component: () => <div>Break Even Calculator</div>
  },
  {
    id: 'margin-pricing',
    slug: 'margin-pricing',
    title: '마진율 및 가격 책정 계산기',
    description: '원가 대비 적정 판매가 및 마진을 계산합니다',
    icon: '📊',
    category: 'revenue',
    isAvailable: true,
    component: () => <div>Margin Pricing Calculator</div>
  },
  {
    id: 'inventory-turnover',
    slug: 'inventory-turnover',
    title: '재고 회전율 및 비용 계산기',
    description: '재고 효율성 측정, 불용재고 비용을 분석합니다',
    icon: '📦',
    category: 'efficiency',
    isAvailable: true,
    component: () => <div>Inventory Turnover Calculator</div>
  },
  {
    id: 'income-tax',
    slug: 'income-tax',
    title: '종합소득세 예상 계산기',
    description: '연소득 및 필요경비 기반 소득세를 예측합니다',
    icon: '📋',
    category: 'cost',
    isAvailable: true,
    component: () => <div>Income Tax Calculator</div>
  },
  {
    id: 'vat',
    slug: 'vat',
    title: '부가가치세 예상 계산기',
    description: '매출·매입 비교를 통한 부가세를 계산합니다',
    icon: '🧾',
    category: 'cost',
    isAvailable: true,
    component: () => <div>VAT Calculator</div>
  },
  {
    id: 'insurance',
    slug: 'insurance',
    title: '4대보험료 계산기',
    description: '사업주/직원 부담금을 계산합니다',
    icon: '🛡️',
    category: 'cost',
    isAvailable: true,
    component: () => <div>Insurance Calculator</div>
  },
  {
    id: 'revenue-increase',
    slug: 'revenue-increase',
    title: '매출 증가 추정 계산기',
    description: '테이블오더 도입 시 전환율 개선으로 인한 매출 증가를 계산해보세요',
    icon: '📈',
    category: 'revenue',
    isAvailable: true,
    component: () => <div>Revenue Calculator</div>
  }
];

const categories = [
  { id: 'all', label: '전체', count: calculators.length },
  { id: 'revenue', label: '매출', count: calculators.filter(c => c.category === 'revenue').length },
  { id: 'cost', label: '비용', count: calculators.filter(c => c.category === 'cost').length },
  { id: 'efficiency', label: '효율성', count: calculators.filter(c => c.category === 'efficiency').length },
  // { id: 'roi', label: 'ROI', count: calculators.filter(c => c.category === 'roi').length }
];

export const CalculatorHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculators = calculators.filter(calculator => {
    const matchesCategory = selectedCategory === 'all' || calculator.category === selectedCategory;
    const matchesSearch = calculator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        calculator.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCalculatorClick = (calculator: Calculator) => {
    if (calculator.isAvailable) {
      window.location.href = `/calc/${calculator.slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-36">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            사장님의 경영 파트너, 자영업 계산기
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            매출은 올리고 비용은 줄이는 경영 인사이트를 숫자로 확인하세요
          </p>
          <BannerRow />
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          {/* 검색 */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="계산기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                  }
                `}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* 계산기 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calculator) => (
            <CalculatorCard
              key={calculator.id}
              calculator={calculator}
              onClick={() => handleCalculatorClick(calculator)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 