export interface Calculator {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: 'revenue' | 'cost' | 'efficiency' | 'roi';
  isAvailable: boolean;
  component: React.ComponentType;
}

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'percent' | 'currency';
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
}

export interface CalculatorResult {
  label: string;
  value: number;
  unit?: string;
  format?: 'currency' | 'percent' | 'number' | 'text';
  description?: string;
}

