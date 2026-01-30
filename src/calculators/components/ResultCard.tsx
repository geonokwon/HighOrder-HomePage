"use client";
import React from 'react';
import { CalculatorResult } from '../types/calculator';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

interface ResultCardProps {
  results: CalculatorResult[];
  title?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ results, title = "계산 결과" }) => {
  const formatValue = (result: CalculatorResult): string => {
    switch (result.format) {
      case 'currency':
        return formatCurrency(result.value);
      case 'percent':
        return formatPercent(result.value);
      case 'text':
        return result.unit || '';
      case 'number':
        return formatNumber(Math.round(result.value));
      default:
        return result.unit 
          ? `${formatNumber(Math.round(result.value))}${result.unit}`
          : formatNumber(Math.round(result.value));
    }
  };

  const formatValueWithUnit = (result: CalculatorResult) => {
    switch (result.format) {
      case 'currency':
        return formatCurrency(result.value);
      case 'percent':
        return formatPercent(result.value);
      case 'number':
        return formatNumber(Math.round(result.value));
      default:
        return result.unit
        ? `${formatNumber(Math.round(result.value))}${result.unit}`
        : formatNumber(Math.round(result.value));
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">{result.label}</p>
              {result.description && (
                <p className="text-xs text-gray-500 mt-1">{result.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatValue(result)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 