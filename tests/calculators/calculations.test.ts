import { calculateSeverancePay, calculateIncomeTax, IncomeExpenseMethod } from '../../src/calculators/utils/calculations';

describe('calculateSeverancePay', () => {
  test('uses direct averageDailyWage when provided', () => {
    const result = calculateSeverancePay({
      yearsOfService: 5,
      monthsOfService: 0,
      averageDailyWage: 100_000
    });

    expect(result.totalMonths).toBe(60);
    expect(result.averageDailyWage).toBe(100_000);
    expect(Math.round(result.severancePay)).toBe(100_000 * 30 * 5);
  });

  test('computes averageDailyWage from recent three months when direct value missing', () => {
    const result = calculateSeverancePay({
      yearsOfService: 3,
      monthsOfService: 6,
      recentThreeMonthsTotal: 9_000_000,
      periodDays: 90
    });

    expect(result.totalMonths).toBe(42);
    expect(result.averageDailyWage).toBeCloseTo(100_000);
    expect(Math.round(result.severancePay)).toBe(100_000 * 30 * 3.5);
  });
});

describe('calculateIncomeTax', () => {
  test('simple expense method uses expenseRate on revenue', () => {
    const result = calculateIncomeTax({
      method: 'simple',
      revenue: 100_000_000,
      expenseRate: 20,
      dependents: 1,
      deductions: 2_000_000
    });

    expect(result.necessaryExpenses).toBe(20_000_000);
    expect(result.taxableIncome).toBe(78_000_000);
    expect(result.finalTaxableIncome).toBe(76_500_000);
    expect(result.taxRate).toBe(24);
    expect(result.estimatedTax).toBeCloseTo(18_360_000);
  });

  test('actual expense method sums purchases and otherExpenses', () => {
    const result = calculateIncomeTax({
      method: 'actual',
      revenue: 100_000_000,
      purchases: 30_000_000,
      otherExpenses: 10_000_000,
      dependents: 0,
      deductions: 0
    });

    expect(result.necessaryExpenses).toBe(40_000_000);
    expect(result.taxableIncome).toBe(60_000_000);
    expect(result.finalTaxableIncome).toBe(60_000_000);
    expect(result.taxRate).toBe(24);
    expect(result.estimatedTax).toBeCloseTo(14_400_000);
  });
});


