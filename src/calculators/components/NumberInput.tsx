"use client";
import React from 'react';
import { CalculatorInput } from '../types/calculator';
import { HtmlContext } from 'next/dist/server/route-modules/pages/vendored/contexts/entrypoints';
import { parse } from 'next/dist/build/swc/generated-native';

interface NumberInputProps {
  input: CalculatorInput;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  input, 
  value, 
  onChange, 
  error 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ''); // 쉼표 제거
    if (value === '') {
      onChange(0);
    } else {
      const newValue = parseFloat(value);
      if (!isNaN(newValue)) {
        onChange(newValue);
      }
    }
  };

  const formatDisplayValue = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('ko-KR');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {input.label}
        {input.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          placeholder={'입력'}
        />
        {input.unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {input.unit}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 