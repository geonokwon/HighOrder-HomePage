import { RevenueCalculator } from '@/calculators/pages/calculators/RevenueCalculator';
import { WeeklyHolidayPayCalculator } from '@/calculators/pages/calculators/WeeklyHolidayPayCalculator';
import { MinimumWageLaborCalculator } from '@/calculators/pages/calculators/MinimumWageLaborCalculator';
import { SeverancePayCalculator } from '@/calculators/pages/calculators/SeverancePayCalculator';
import { BreakEvenCalculator } from '@/calculators/pages/calculators/BreakEvenCalculator';
import { MarginPricingCalculator } from '@/calculators/pages/calculators/MarginPricingCalculator';
import { InventoryTurnoverCalculator } from '@/calculators/pages/calculators/InventoryTurnoverCalculator';
import { IncomeTaxCalculator } from '@/calculators/pages/calculators/IncomeTaxCalculator';
import { VATCalculator } from '@/calculators/pages/calculators/VATCalculator';
import { InsuranceCalculator } from '@/calculators/pages/calculators/InsuranceCalculator';
import Link from 'next/link';

interface CalcPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 동적 라우트 파라미터 허용
export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export default async function CalcSlugPage({ params }: CalcPageProps) {
  const { slug } = await params;

  // 계산기 라우팅
  let content: JSX.Element;
  switch (slug) {
    case 'weekly-holiday-pay':
      content = <WeeklyHolidayPayCalculator />;
      break;
    case 'minimum-wage-labor':
      content = <MinimumWageLaborCalculator />;
      break;
    case 'severance-pay':
      content = <SeverancePayCalculator />;
      break;
    case 'break-even':
      content = <BreakEvenCalculator />;
      break;
    case 'margin-pricing':
      content = <MarginPricingCalculator />;
      break;
    case 'inventory-turnover':
      content = <InventoryTurnoverCalculator />;
      break;
    case 'income-tax':
      content = <IncomeTaxCalculator />;
      break;
    case 'vat':
      content = <VATCalculator />;
      break;
    case 'insurance':
      content = <InsuranceCalculator />;
      break;
    case 'revenue-increase':
      content = <RevenueCalculator />;
      break;
    default:
      content = <div className="p-8 text-center">계산기를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <Link
            href="/calc"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
          >
            ← 계산기 목록
          </Link>
        </div>
      </div>
      {content}
    </>
  );
} 