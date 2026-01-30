"use client";
import React from 'react';
import { Calculator } from '../types/calculator';

interface CalculatorCardProps {
  calculator: Calculator;
  onClick: () => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ calculator, onClick }) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:border-orange-300
        h-32
        ${!calculator.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={calculator.isAvailable ? onClick : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div className="flex items-start space-x-3">
        {/* 아이콘 */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">{calculator.icon}</span>
          </div>
        </div>
        
        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-lg font-bold text-gray-900 mb-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {calculator.title}
            {!calculator.isAvailable && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                개발중
              </span>
            )}
          </h3>
          <p 
            className="text-sm text-gray-600 leading-relaxed"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {calculator.description}
          </p>
        </div>
      </div>
    </div>
  );
}; 