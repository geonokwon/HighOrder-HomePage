// 매출 증가 계산기
export const calculateRevenueIncrease = (inputs: {
  visitors: number;
  currentConversionRate: number;
  conversionRateChange: number;
  averageOrderValue: number;
}) => {
  const { visitors, currentConversionRate, conversionRateChange, averageOrderValue } = inputs;
  
  const currentDailyRevenue = visitors * (currentConversionRate / 100) * averageOrderValue;
  const newConversionRate = currentConversionRate + conversionRateChange;
  const newDailyRevenue = visitors * (newConversionRate / 100) * averageOrderValue;
  const revenueIncrease = newDailyRevenue - currentDailyRevenue;
  const revenueIncreasePercent = currentDailyRevenue > 0 
    ? (revenueIncrease / currentDailyRevenue) * 100 
    : 0;

  return {
    currentDailyRevenue,
    newDailyRevenue,
    revenueIncrease,
    revenueIncreasePercent,
    monthlyRevenueIncrease: revenueIncrease * 30,
    yearlyRevenueIncrease: revenueIncrease * 365
  };
};

// 주휴수당 계산기
export const calculateWeeklyHolidayPay = (inputs: {
  hourlyWage: number;
  weeklyWorkDays: number;
  dailyWorkHours: number;
}) => {
  const { hourlyWage, weeklyWorkDays, dailyWorkHours } = inputs;
  
  const weeklyWorkHours = weeklyWorkDays * dailyWorkHours;
  const isEligibleForHolidayPay = weeklyWorkHours >= 15; // 주 15시간 이상 근무 시
  const weeklyHolidayPay = isEligibleForHolidayPay ? hourlyWage * dailyWorkHours : 0; // 주휴수당 = 시급 × 1일 소정근로시간
  const monthlyHolidayPay = weeklyHolidayPay * 4.345; // 월 평균 주수
  
  return {
    weeklyWorkHours,
    weeklyHolidayPay,
    monthlyHolidayPay,
    isEligibleForHolidayPay
  };
};

// 최저임금 기준 인건비 계산기
export const calculateMinimumWageLabor = (inputs: {
  hourlyWage: number;
  weeklyWorkDays: number;
  dailyWorkHours: number;
}) => {
  const { hourlyWage, weeklyWorkDays, dailyWorkHours } = inputs;
  
  const weeklyWorkHours = weeklyWorkDays * dailyWorkHours;
  const weeklyWage = weeklyWorkHours * hourlyWage;
  const isEligibleForHolidayPay = weeklyWorkHours >= 15; // 주 15시간 이상 근무 시
  const weeklyHolidayPay = isEligibleForHolidayPay ? hourlyWage * dailyWorkHours : 0; // 주휴수당 = 시급 × 1일 소정근로시간
  const weeklyTotalPay = weeklyWage + weeklyHolidayPay;
  const monthlyTotalPay = weeklyTotalPay * 4.345;
  
  return {
    weeklyWorkHours,
    weeklyWage,
    weeklyHolidayPay,
    weeklyTotalPay,
    monthlyTotalPay,
    isEligibleForHolidayPay
  };
};

// 퇴직금 계산기
// 평균임금은 직접 입력하거나 최근 3개월 급여 합계와 기간 일수로 자동 계산할 수 있습니다.
export const calculateSeverancePay = (inputs: {
  yearsOfService: number;
  monthsOfService: number;
  averageDailyWage?: number;
  recentThreeMonthsTotal?: number; // 최근 3개월 총 급여(수당/상여 포함)
  periodDays?: number; // 최근 3개월 기간 일수(통상 90~92일)
}) => {
  const { yearsOfService, monthsOfService } = inputs;

  const computedAverageDailyWage = (() => {
    if (typeof inputs.averageDailyWage === 'number' && inputs.averageDailyWage > 0) {
      return inputs.averageDailyWage;
    }
    if (
      typeof inputs.recentThreeMonthsTotal === 'number' &&
      inputs.recentThreeMonthsTotal > 0 &&
      typeof inputs.periodDays === 'number' &&
      inputs.periodDays > 0
    ) {
      return inputs.recentThreeMonthsTotal / inputs.periodDays;
    }
    return 0;
  })();

  const totalMonths = yearsOfService * 12 + monthsOfService;
  const severancePay = computedAverageDailyWage * 30 * (totalMonths / 12);
  
  return {
    totalMonths,
    averageDailyWage: computedAverageDailyWage,
    severancePay
  };
};

// 손익분기점 계산기
export const calculateBreakEven = (inputs: {
  fixedCost: number;
  unitPrice: number;
  variableCost: number;
  expectedSales: number;
}) => {
  const { fixedCost, unitPrice, variableCost, expectedSales } = inputs;
  
  const contributionMargin = unitPrice - variableCost;
  const breakEvenQuantity = fixedCost / contributionMargin;
  const breakEvenRevenue = breakEvenQuantity * unitPrice;
  const profit = (expectedSales - breakEvenQuantity) * contributionMargin;
  
  return {
    contributionMargin,
    breakEvenQuantity,
    breakEvenRevenue,
    profit
  };
};

// 고급 손익분기점 계산기 (단일/믹스 모드, VAT 처리, 채널 가중, 손실/환불/무료제공, 단계고정비)
export type BreakEvenMode = 'single' | 'mix';

export interface BreakEvenAdvancedInputsSingle {
  mode: 'single';
  price: number; // 입력 단가
  vatIncluded: boolean; // true면 부가세 포함 입력
  discounts: { discountRatePct: number; promotionSharePct: number; refundRatePct: number; freeProvisionPct: number };
  variableCosts: {
    rawMaterial: number; // 원재료비(단위당)
    lossRatePct: number; // 폐기/로스율(%), 원가 가산
    packagingInStore: number; // 내점 포장/소모품
    packagingDelivery: number; // 배달 포장/소모품
    paymentFeeRatePct: number; // 결제수수료율(%)
    paymentFixedFee: number; // 결제 정액 수수료
    platformFeeRatePctDelivery: number; // 배달 플랫폼 수수료율(%)
    platformFixedFeeDelivery: number; // 배달 플랫폼 정액 수수료
    royaltyRatePct: number; // 로열티/브랜드 사용료(%)
    variableLaborPerOrder: number; // 주문당 인건비 변동분
  };
  channel: { inStoreSharePct: number; deliverySharePct: number };
  fixedCosts: { rent: number; managerSalary: number; employerInsurance: number; utilitiesBase: number; depreciation: number; marketingFixed: number; saasFee: number };
  stepFixedCosts?: { thresholdQ: number; additionalFixedCost: number }[]; // 단계고정비 규칙
  expectedOrders?: number; // MOS 계산용 기대 주문수
  targetProfit?: number; // 목표 이익 T
}

export interface MixItem {
  price: number;
  variableCost: number;
  weightPct: number; // 믹스 비중 %
}

export interface BreakEvenAdvancedInputsMix {
  mode: 'mix';
  items: MixItem[];
  vatIncluded: boolean;
  fixedCosts: { rent: number; managerSalary: number; employerInsurance: number; utilitiesBase: number; depreciation: number; marketingFixed: number; saasFee: number };
}

export type BreakEvenAdvancedInputs = BreakEvenAdvancedInputsSingle | BreakEvenAdvancedInputsMix;

export const calculateBreakEvenAdvanced = (inputs: BreakEvenAdvancedInputs) => {
  const sumFixedCosts = (fc: { [k: string]: number }) => Object.values(fc).reduce((a, b) => a + (b || 0), 0);
  const toRate = (pct: number) => (Math.max(0, pct) / 100);
  const priceExVatFrom = (price: number, vatIncluded: boolean) => (vatIncluded ? price / 1.1 : price);

  if (inputs.mode === 'single') {
    const priceExVat = priceExVatFrom(inputs.price, inputs.vatIncluded);
    const discountFactor = 1 - toRate(inputs.discounts.discountRatePct) - toRate(inputs.discounts.promotionSharePct) - toRate(inputs.discounts.freeProvisionPct) - toRate(inputs.discounts.refundRatePct);
    const realizedPrice = Math.max(0, priceExVat * discountFactor);

    const lossMultiplier = 1 + toRate(inputs.variableCosts.lossRatePct);
    const rawCost = inputs.variableCosts.rawMaterial * lossMultiplier;

    // 채널별 변동비 계산
    const inStoreVC = rawCost
      + inputs.variableCosts.packagingInStore
      + realizedPrice * toRate(inputs.variableCosts.paymentFeeRatePct)
      + inputs.variableCosts.paymentFixedFee
      + realizedPrice * toRate(inputs.variableCosts.royaltyRatePct)
      + inputs.variableCosts.variableLaborPerOrder;
    const deliveryVC = rawCost
      + inputs.variableCosts.packagingDelivery
      + realizedPrice * toRate(inputs.variableCosts.paymentFeeRatePct)
      + inputs.variableCosts.paymentFixedFee
      + realizedPrice * toRate(inputs.variableCosts.platformFeeRatePctDelivery)
      + inputs.variableCosts.platformFixedFeeDelivery
      + realizedPrice * toRate(inputs.variableCosts.royaltyRatePct)
      + inputs.variableCosts.variableLaborPerOrder;

    const wIn = Math.max(0, inputs.channel.inStoreSharePct) / 100;
    const wDel = Math.max(0, inputs.channel.deliverySharePct) / 100;
    const wSum = wIn + wDel || 1;
    const wnIn = wIn / wSum;
    const wnDel = wDel / wSum;

    const cmIn = realizedPrice - inStoreVC;
    const cmDel = realizedPrice - deliveryVC;
    const contributionMarginAvg = wnIn * cmIn + wnDel * cmDel;

    let fixedCost = sumFixedCosts(inputs.fixedCosts);
    // 1차 BEP로 단계고정비 반영
    let breakEvenQuantity = contributionMarginAvg > 0 ? fixedCost / contributionMarginAvg : Infinity;
    if (inputs.stepFixedCosts && inputs.stepFixedCosts.length > 0) {
      const extra = inputs.stepFixedCosts
        .filter(r => breakEvenQuantity >= r.thresholdQ)
        .reduce((a, b) => a + b.additionalFixedCost, 0);
      fixedCost += extra;
      breakEvenQuantity = contributionMarginAvg > 0 ? fixedCost / contributionMarginAvg : Infinity;
    }

    const breakEvenSalesExVat = breakEvenQuantity * realizedPrice;
    const cmr = realizedPrice > 0 ? (contributionMarginAvg / realizedPrice) : 0;
    const targetProfit = inputs.targetProfit ?? 0;
    const quantityForTargetProfit = contributionMarginAvg > 0 ? (fixedCost + targetProfit) / contributionMarginAvg : Infinity;

    const expectedOrders = inputs.expectedOrders ?? 0;
    const marginOfSafety = expectedOrders > 0 && isFinite(breakEvenQuantity)
      ? Math.max(0, (expectedOrders * realizedPrice - breakEvenSalesExVat) / (expectedOrders * realizedPrice))
      : 0;

    return {
      mode: 'single' as const,
      priceExVat,
      realizedPrice,
      cmIn,
      cmDel,
      contributionMarginAvg,
      breakEvenQuantity,
      breakEvenSalesExVat,
      contributionMarginRatio: cmr,
      quantityForTargetProfit,
      marginOfSafety,
      fixedCost,
    };
  }

  // mix mode
  const priceExVatItems = inputs.items.map(i => ({ ...i, priceExVat: priceExVatFrom(i.price, inputs.vatIncluded) }));
  const wSum = priceExVatItems.reduce((a, b) => a + (Math.max(0, b.weightPct) / 100), 0) || 1;
  const weighted = priceExVatItems.map(i => {
    const w = (Math.max(0, i.weightPct) / 100) / wSum;
    const cm = i.priceExVat - i.variableCost;
    const cmr = i.priceExVat > 0 ? cm / i.priceExVat : 0;
    return { w, cm, cmr };
  });
  const avgCMR = weighted.reduce((a, b) => a + b.w * b.cmr, 0);
  const avgCM = weighted.reduce((a, b) => a + b.w * b.cm, 0);
  const fixedCost = sumFixedCosts(inputs.fixedCosts);
  const breakEvenSalesExVat = avgCMR > 0 ? fixedCost / avgCMR : Infinity;
  const breakEvenQuantity = avgCM > 0 ? fixedCost / avgCM : Infinity;
  return {
    mode: 'mix' as const,
    averageContributionMarginRatio: avgCMR,
    contributionMarginAvg: avgCM,
    breakEvenSalesExVat,
    breakEvenQuantity,
    fixedCost,
  };
};

// 마진율 및 가격 책정 계산기 (세분화 버전)
export const calculateMarginPricing = (inputs: {
  // 세분화된 원가 항목들
  materialCosts?: {
    [key: string]: number; // 재료명: 금액
  };
  packagingCosts?: {
    [key: string]: number; // 포장재명: 금액
  };
  laborCosts?: {
    [key: string]: number; // 인건비 항목: 금액
  };
  overheadCosts?: {
    [key: string]: number; // 간접비 항목: 금액
  };
  // 기존 단순 입력 (하위 호환성)
  cost?: number;
  targetMargin?: number;
  sellingPrice?: number;
}) => {
  const { 
    materialCosts = {}, 
    packagingCosts = {}, 
    laborCosts = {}, 
    overheadCosts = {},
    cost,
    targetMargin, 
    sellingPrice 
  } = inputs;
  
  // 세분화된 원가 계산
  const totalMaterialCost = Object.values(materialCosts).reduce((sum, cost) => sum + cost, 0);
  const totalPackagingCost = Object.values(packagingCosts).reduce((sum, cost) => sum + cost, 0);
  const totalLaborCost = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
  const totalOverheadCost = Object.values(overheadCosts).reduce((sum, cost) => sum + cost, 0);
  
  // 총 원가 계산 (세분화된 원가가 있으면 사용, 없으면 기존 cost 사용)
  const totalCost = totalMaterialCost + totalPackagingCost + totalLaborCost + totalOverheadCost > 0
    ? totalMaterialCost + totalPackagingCost + totalLaborCost + totalOverheadCost
    : (cost || 0);
  
  if (targetMargin !== undefined) {
    // 원가와 목표 마진율로 판매가 계산
    const calculatedPrice = totalCost / (1 - targetMargin / 100);
    const actualMargin = ((calculatedPrice - totalCost) / calculatedPrice) * 100;
    
    return {
      sellingPrice: calculatedPrice,
      margin: actualMargin,
      profit: calculatedPrice - totalCost,
      totalCost,
      costBreakdown: {
        materialCosts: totalMaterialCost,
        packagingCosts: totalPackagingCost,
        laborCosts: totalLaborCost,
        overheadCosts: totalOverheadCost
      }
    };
  } else if (sellingPrice !== undefined) {
    // 원가와 판매가로 마진율 계산
    const margin = ((sellingPrice - totalCost) / sellingPrice) * 100;
    const profit = sellingPrice - totalCost;
    
    return {
      sellingPrice,
      margin,
      profit,
      totalCost,
      costBreakdown: {
        materialCosts: totalMaterialCost,
        packagingCosts: totalPackagingCost,
        laborCosts: totalLaborCost,
        overheadCosts: totalOverheadCost
      }
    };
  }
  
  return {
    sellingPrice: 0,
    margin: 0,
    profit: 0,
    totalCost,
    costBreakdown: {
      materialCosts: totalMaterialCost,
      packagingCosts: totalPackagingCost,
      laborCosts: totalLaborCost,
      overheadCosts: totalOverheadCost
    }
  };
};

// 재고 회전율 및 비용 계산기
export const calculateInventoryTurnover = (inputs: {
  averageInventory: number;
  costOfGoodsSold: number;
  holdingDays: number;
}) => {
  const { averageInventory, costOfGoodsSold, holdingDays } = inputs;
  
  const inventoryTurnover = costOfGoodsSold / averageInventory;
  const daysToSell = 365 / inventoryTurnover;
  const holdingCost = averageInventory * (holdingDays / 365) * 0.1; // 연 10% 비용 가정
  
  return {
    inventoryTurnover,
    daysToSell,
    holdingCost
  };
};

// 종합소득세 예상 계산기
// 경비 산정 방식(method)에 따라 필요경비를 계산합니다.
export type IncomeExpenseMethod = 'simple' | 'standard' | 'actual';

export const calculateIncomeTax = (inputs: {
  method: IncomeExpenseMethod;
  revenue: number; // 매출액(수입금액)
  expenseRate?: number; // 단순/기준 경비율(%)
  purchases?: number; // 매입액(세금계산서 등 공제대상)
  otherExpenses?: number; // 기타 필요경비(임차료, 인건비 등)
  dependents: number; // 총 부양가족 수(상세 미입력 시)
  deductions: number; // 각종 공제 합계
  spouseEligible?: boolean;
  parentsCount?: number;
  childrenCount?: number;
  disabledCount?: number;
  otherDependentsCount?: number;
  useStandardTaxCredit?: boolean;
  useElectronicFilingCredit?: boolean;
  applyChildTaxCredit?: boolean;
}) => {
  const {
    method,
    revenue,
    expenseRate,
    purchases = 0,
    otherExpenses = 0,
    dependents,
    deductions,
    spouseEligible = false,
    parentsCount = 0,
    childrenCount = 0,
    disabledCount = 0,
    otherDependentsCount = 0,
    useStandardTaxCredit = false,
    useElectronicFilingCredit = false,
    applyChildTaxCredit = true
  } = inputs;

  // 필요경비 계산
  const necessaryExpenses = (() => {
    if (method === 'actual') {
      return purchases + otherExpenses;
    }
    // simple or standard: 사용자 입력 경비율 사용(업종/규모별 실제율은 별도 안내)
    const ratio = typeof expenseRate === 'number' ? Math.max(0, Math.min(100, expenseRate)) : 0;
    return revenue * (ratio / 100);
  })();

  const taxableIncome = Math.max(0, revenue - necessaryExpenses - deductions);

  // 상세 인적공제 합산(본인 1인 포함)
  const basicDeductionCountDetailed = 1
    + (spouseEligible ? 1 : 0)
    + Math.max(0, parentsCount)
    + Math.max(0, childrenCount)
    + Math.max(0, disabledCount)
    + Math.max(0, otherDependentsCount);
  const basicDeductionCount = Math.max(basicDeductionCountDetailed, Math.max(1, dependents));
  const basicDeductionAmount = basicDeductionCount * 1_500_000;
  const finalTaxableIncome = Math.max(0, taxableIncome - basicDeductionAmount);


  // ================================
  // 소득세 계산

  // 국민연금 x 
  // 누진세 계산 산식 수정
  // 자녀세엑 공제 금액 변경
  // 1명인 경우 연 25만원
  // 2명인 경우 연 55만원
  // 3명인 이상인 경우 40만원 초과당 * 곱으로 계산 
  // 8세 이상 적용!!
  
  // ================================

  // 누진세(구간별 합산) - 2025년 기준
  const brackets = [
    { limit: 12_000_000, rate: 0.06, progressiveDeduction: 0 },
    { limit: 46_000_000, rate: 0.15, progressiveDeduction: 1_080_000 },
    { limit: 88_000_000, rate: 0.24, progressiveDeduction: 5_220_000 },
    { limit: 150_000_000, rate: 0.35, progressiveDeduction: 14_900_000 },
    { limit: 300_000_000, rate: 0.38, progressiveDeduction: 19_400_000 },
    { limit: 500_000_000, rate: 0.40, progressiveDeduction: 25_400_000 },
    { limit: Infinity, rate: 0.42, progressiveDeduction: 35_400_000 }
  ];
  // 누진공제액 방식으로 계산 (2025년 기준)
  let nationalBeforeCredits = 0;
  let marginalRate = 0;
  let progressiveDeduction = 0;
  
  // 해당 구간 찾기
  for (const bracket of brackets) {
    if (finalTaxableIncome <= bracket.limit) {
      nationalBeforeCredits = finalTaxableIncome * bracket.rate - bracket.progressiveDeduction;
      marginalRate = bracket.rate;
      progressiveDeduction = bracket.progressiveDeduction;
      break;
    }
  }
  
  // 음수 방지
  nationalBeforeCredits = Math.max(0, nationalBeforeCredits);

  // 세액공제
  let taxCredits = 0;
  if (useStandardTaxCredit) taxCredits += 70_000;
  if (useElectronicFilingCredit) taxCredits += 20_000;
  if (applyChildTaxCredit && childrenCount > 0) {
    // 2025년 자녀세액공제: 1명 25만원, 2명 55만원, 3명 이상은 추가당 30만원
    if (childrenCount === 1) {
      taxCredits += 250_000;
    } else if (childrenCount === 2) {
      taxCredits += 550_000;
    } else {
      taxCredits += 550_000 + (childrenCount - 2) * 300_000;
    }
  }
  const nationalIncomeTax = Math.max(0, nationalBeforeCredits - taxCredits);
  const localIncomeTax = Math.max(0, Math.floor(nationalIncomeTax * 0.1));
  const totalPayable = nationalIncomeTax + localIncomeTax;
  
  return {
    necessaryExpenses,
    taxableIncome,
    finalTaxableIncome,
    basicDeductionCount,
    basicDeductionAmount,
    nationalIncomeTax,
    localIncomeTax,
    totalPayable,
    taxCredits,
    progressiveDeduction,
    taxRate: marginalRate * 100,
    estimatedTax: nationalIncomeTax
  };
};

// 부가가치세 예상 계산기
export const calculateVAT = (inputs: {
  totalSales: number;
  totalPurchases: number;
  hasTaxInvoice: boolean;
  creditCardSales?: number; // 신용카드 매출액
  cashReceiptSales?: number; // 현금영수증 매출액
}) => {
  const { totalSales, totalPurchases, hasTaxInvoice, creditCardSales = 0, cashReceiptSales = 0 } = inputs;
  
  const salesVAT = totalSales * 0.1; // 매출 부가세
  const purchaseVAT = hasTaxInvoice ? totalPurchases * 0.1 : 0; // 매입 부가세
  
  // 신용카드 매출전표 등 발행공제 (2025년 기준: 1.3%, 한도 1,000만원)
  const cardSalesDeduction = (() => {
    const totalCardSales = creditCardSales + cashReceiptSales;
    const deductionAmount = totalCardSales * 0.013; // 1.3%
    return Math.min(deductionAmount, 10_000_000); // 한도 1,000만원
  })();
  
  const payableVAT = Math.max(0, salesVAT - purchaseVAT - cardSalesDeduction); // 납부할 부가세
  
  return {
    salesVAT,
    purchaseVAT,
    cardSalesDeduction,
    payableVAT
  };
};

// 4대보험료 계산기
export const calculateInsurance = (inputs: {
  monthlySalary: number;
  employeeType: 'regular' | 'partTime';
  hasDependents: boolean;
  weeklyWorkDays?: number;
  dailyWorkHours?: number;
  monthsWorked?: number;
  excludeNationalPension?: boolean; // 국민연금 제외 옵션
}) => {
  const {
    monthlySalary,
    employeeType,
    hasDependents,
    weeklyWorkDays = 5,
    dailyWorkHours = 8,
    monthsWorked = 1,
    excludeNationalPension = false,
  } = inputs;

  const weeklyWorkHours = (weeklyWorkDays ?? 0) * (dailyWorkHours ?? 0);
  const isUnder15Hours = weeklyWorkHours < 15;
  const HEALTH_INCOME_THRESHOLD_2025 = 1_220_000; // 약 기준

  // 적용여부 판정
  const appliesNationalPension = !isUnder15Hours && !excludeNationalPension; // 15시간 미만이면 의무 없음, 또는 사용자가 제외 선택
  const appliesEmploymentInsurance = !(isUnder15Hours && monthsWorked < 3); // 15시간 미만+3개월 미만이면 의무 없음
  const appliesHealthInsurance = !(isUnder15Hours && monthlySalary < HEALTH_INCOME_THRESHOLD_2025); // 15시간 미만이면서 소득 기준 미만이면 직장가입 의무 없음
  const appliesIndustrialAccident = true; // 산재보험은 근로시간 무관, 근로자 부담 0

  // 요율(근로자 부담분 가정)
  const HEALTH_RATE = 0.03545;
  const PENSION_RATE = 0.045;
  const EMPLOYMENT_RATE = 0.008;

  const healthInsurance = appliesHealthInsurance ? monthlySalary * HEALTH_RATE : 0;
  const nationalPension = appliesNationalPension ? monthlySalary * PENSION_RATE : 0;
  const employmentInsurance = appliesEmploymentInsurance ? monthlySalary * EMPLOYMENT_RATE : 0;
  const industrialAccidentInsurance = 0; // 근로자 부담 없음(사업주 전액)

  const totalInsurance = healthInsurance + nationalPension + employmentInsurance + industrialAccidentInsurance;

  return {
    weeklyWorkHours,
    applies: {
      health: appliesHealthInsurance,
      pension: appliesNationalPension,
      employment: appliesEmploymentInsurance,
      industrialAccident: appliesIndustrialAccident,
    },
    thresholds: {
      healthIncomeThreshold: HEALTH_INCOME_THRESHOLD_2025,
    },
    healthInsurance,
    nationalPension,
    employmentInsurance,
    industrialAccidentInsurance,
    totalInsurance,
  };
};

// ROI 계산기
export const calculateROI = (inputs: {
  initialCost: number;
  monthlyCost: number;
  monthlyProfit: number;
}) => {
  const { initialCost, monthlyCost, monthlyProfit } = inputs;
  
  const monthlyNetProfit = monthlyProfit - monthlyCost;
  
  if (monthlyNetProfit <= 0) {
    return {
      paybackMonths: Infinity,
      yearlyROI: 0
    };
  }
  
  const paybackMonths = initialCost / monthlyNetProfit;
  const yearlyNetProfit = monthlyNetProfit * 12;
  const yearlyROI = (yearlyNetProfit / initialCost) * 100;
  
  return {
    paybackMonths,
    yearlyROI
  };
}; 