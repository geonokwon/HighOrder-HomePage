"use client";
import React, { useMemo, useState } from 'react';
import { NumberInput } from '../../components/NumberInput';
import BannerRow from '../../components/BannerRow';
import { ResultCard } from '../../components/ResultCard';
import { calculateBreakEvenAdvanced } from '../../utils/calculations';
import { CalculatorResult } from '../../types/calculator';
import { Kayaking } from '@mui/icons-material';
import { m } from 'framer-motion';

type Mode = 'simple' | 'advanced';


export const BreakEvenCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('advanced');
  const [vatIncluded, setVatIncluded] = useState(true);

  const [values, setValues] = useState<Record<string, number>>({
    // Price & discounts
    price: 11000,
    discountRatePct: 0,
    promotionSharePct: 0,
    refundRatePct: 0,
    freeProvisionPct: 0,
    // Variable costs
    rawMaterial: 5000,
    lossRatePct: 0,
    packagingInStore: 300,
    packagingDelivery: 800,
    paymentFeeRatePct: 2.5,
    paymentFixedFee: 0,
    platformFeeRatePctDelivery: 10,
    platformFixedFeeDelivery: 200,
    royaltyRatePct: 0,
    variableLaborPerOrder: 0,
    // Channel shares
    inStoreSharePct: 70,
    deliverySharePct: 30,
    // Fixed costs
    rent: 1000000,
    managerSalary: 0,
    employerInsurance: 0,
    utilitiesBase: 150000,
    depreciation: 0,
    marketingFixed: 0,
    saasFee: 0,
    // Options
    expectedOrders: 2000,
    targetProfit: 0,
    stepThresholdQ: 3000,
    stepAdditionalFixed: 2000000,
  });

  const handle = (name: string, value: number) => setValues(prev => ({ ...prev, [name]: value }));

  const calculation = useMemo(() => {

    const fixedCosts = {
      rent: values.rent,
      managerSalary: values.managerSalary,
      employerInsurance: values.employerInsurance,
      utilitiesBase: values.utilitiesBase,
      depreciation: values.depreciation,
      marketingFixed: values.marketingFixed,
      saasFee: values.saasFee,
    };
    const variableCosts = {
      rawMaterial: values.rawMaterial,
      lossRatePct: values.lossRatePct,
      packagingInStore: values.packagingInStore,
      packagingDelivery: values.packagingDelivery,
      paymentFeeRatePct: values.paymentFeeRatePct,
      paymentFixedFee: values.paymentFixedFee,
      platformFeeRatePctDelivery: values.platformFeeRatePctDelivery,
      platformFixedFeeDelivery: values.platformFixedFeeDelivery,
      royaltyRatePct: values.royaltyRatePct,
      variableLaborPerOrder: values.variableLaborPerOrder,
    };
    const discounts = {
      discountRatePct: values.discountRatePct,
      promotionSharePct: values.promotionSharePct,
      refundRatePct: values.refundRatePct,
      freeProvisionPct: values.freeProvisionPct,
    };
    const channel = {
      inStoreSharePct: values.inStoreSharePct,
      deliverySharePct: values.deliverySharePct,
    };

    return calculateBreakEvenAdvanced({
      mode: 'single',
      price: values.price,
      vatIncluded,
      discounts,
      variableCosts,
      channel,
      fixedCosts,
      expectedOrders: values.expectedOrders,
      targetProfit: values.targetProfit,
      stepFixedCosts: values.stepAdditionalFixed > 0 ? [{ thresholdQ: values.stepThresholdQ, additionalFixedCost: values.stepAdditionalFixed }] : undefined,
    });
  }, [values, vatIncluded]);

  const results: CalculatorResult[] = useMemo(() => {
    const calc: any = calculation as any;
    const cmAvg = calc.contributionMarginAvg ?? 0;
    const cmr = calc.contributionMarginRatio ?? 0;
    const qBep = calc.breakEvenQuantity as number;
    const sBep = calc.breakEvenSalesExVat as number;
    const isInfinite = !isFinite(qBep) || cmAvg <= 0 || cmr <= 0;

    return [
      { label: '단가(부가세 제외)', value: calc.priceExVat, format: 'currency' },
      { label: '실판매가(할인/무료/환불 반영)', value: calc.realizedPrice, format: 'currency' },
      { label: '공헌마진(내점)', value: calc.cmIn ?? 0, format: 'currency' },
      { label: '공헌마진(배달)', value: calc.cmDel ?? 0, format: 'currency' },
      { label: '가중 평균 공헌마진', value: cmAvg, format: 'currency' },
      isInfinite
        ? { label: '손익분기점 수량(Q_BEP)', value: 0, format: 'text', unit: '무한대' }
        : { label: '손익분기점 수량(Q_BEP)', value: qBep },
      isInfinite
        ? { label: '손익분기점 매출(S_BEP, VAT별도)', value: 0, format: 'text', unit: '무한대' }
        : { label: '손익분기점 매출(S_BEP, VAT별도)', value: sBep, format: 'currency' },
      { label: '공헌이익률(CMR)', value: (cmr ?? 0) * 100, format: 'percent' },
      isInfinite
        ? { label: '목표이익 달성 수량(Q_T)', value: 0, format: 'text', unit: '무한대' }
        : { label: '목표이익 달성 수량(Q_T)', value: calc.quantityForTargetProfit ?? 0 },
      { label: '안전여유율(MOS)', value: ((calc.marginOfSafety ?? 0) * 100), format: 'percent' },
    ];
  }, [calculation]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-36">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">손익분기점 계산기</h1>
        <p className="text-gray-600">현실 변수를 반영해 공헌이익, BEP, MOS를 계산합니다</p>
        <BannerRow />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          className={`px-3 py-1 rounded-full text-sm border ${mode === 'simple' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
          onClick={() => setMode('simple')}
        >간단모드</button>
        <button
          className={`px-3 py-1 rounded-full text-sm border ${mode === 'advanced' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
          onClick={() => setMode('advanced')}
        >고급모드</button>
        <button
          className={`px-3 py-1 rounded-full text-sm border ${vatIncluded ? 'bg-white border-gray-300' : 'bg-gray-900 text-white border-gray-900'}`}
          onClick={() => setVatIncluded(v => !v)}
          aria-pressed={vatIncluded}
        >{vatIncluded ? '단가 입력: VAT 포함' : '단가 입력: VAT 별도'}</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">입력값</h2>
          <div className="space-y-6">
            {/* Price & discounts */}
            <NumberInput input={{ name: 'price', label: '판매단가', type: 'currency', defaultValue: 11000, min: 0, unit: '원' }} value={values.price} onChange={v => handle('price', v)} />
            
            {mode === 'advanced' && (
              <div className="grid grid-cols-2 gap-4">
                <NumberInput input={{ name: 'discountRatePct', label: '할인/쿠폰율(%)', type: 'percent', defaultValue: 0, min: 0, max: 100, unit: '%' }} value={values.discountRatePct} onChange={v => handle('discountRatePct', v)} />
                <NumberInput input={{ name: 'promotionSharePct', label: '프로모션 비중(%)', type: 'percent', defaultValue: 0, min: 0, max: 100, unit: '%' }} value={values.promotionSharePct} onChange={v => handle('promotionSharePct', v)} />
                <NumberInput input={{ name: 'refundRatePct', label: '환불·컴플레인 비율(%)', type: 'percent', defaultValue: 0, min: 0, max: 100, unit: '%' }} value={values.refundRatePct} onChange={v => handle('refundRatePct', v)} />
                <NumberInput input={{ name: 'freeProvisionPct', label: '무료제공/서비스 비율(%)', type: 'percent', defaultValue: 0, min: 0, max: 100, unit: '%' }} value={values.freeProvisionPct} onChange={v => handle('freeProvisionPct', v)} />
              </div>
            )}

            {/* Channel shares */}
            <div className="grid grid-cols-2 gap-4">
              <NumberInput input={{ name: 'inStoreSharePct', label: '내점 비중(%)', type: 'percent', defaultValue: 70, min: 0, max: 100, unit: '%' }} value={values.inStoreSharePct} onChange={v => handle('inStoreSharePct', v)} />
              <NumberInput input={{ name: 'deliverySharePct', label: '배달 비중(%)', type: 'percent', defaultValue: 30, min: 0, max: 100, unit: '%' }} value={values.deliverySharePct} onChange={v => handle('deliverySharePct', v)} />
            </div>

            {/* Variable costs */}
            <h3 className="text-md font-semibold text-gray-900">변동비(주문 1건당)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <NumberInput input={{ name: 'rawMaterial', label: '원재료비', type: 'currency', defaultValue: 5000, min: 0, unit: '원' }} value={values.rawMaterial} onChange={v => handle('rawMaterial', v)} />
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'lossRatePct', label: '폐기·로스율(%)', type: 'percent', defaultValue: 0, min: 0, max: 100, unit: '%' }} value={values.lossRatePct} onChange={v => handle('lossRatePct', v)} />
              )}
              <NumberInput input={{ name: 'packagingInStore', label: '포장·소모품(내점)', type: 'currency', defaultValue: 300, min: 0, unit: '원' }} value={values.packagingInStore} onChange={v => handle('packagingInStore', v)} />
              <NumberInput input={{ name: 'packagingDelivery', label: '포장·소모품(배달)', type: 'currency', defaultValue: 800, min: 0, unit: '원' }} value={values.packagingDelivery} onChange={v => handle('packagingDelivery', v)} />
              <NumberInput input={{ name: 'paymentFeeRatePct', label: '결제수수료(%)', type: 'percent', defaultValue: 2.5, min: 0, max: 100, unit: '%' }} value={values.paymentFeeRatePct} onChange={v => handle('paymentFeeRatePct', v)} />
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'paymentFixedFee', label: '결제 정액 수수료', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.paymentFixedFee} onChange={v => handle('paymentFixedFee', v)} />
              )}
              <NumberInput input={{ name: 'platformFeeRatePctDelivery', label: '플랫폼 수수료(배달 %)', type: 'percent', defaultValue: 10, min: 0, max: 100, unit: '%' }} value={values.platformFeeRatePctDelivery} onChange={v => handle('platformFeeRatePctDelivery', v)} />
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'platformFixedFeeDelivery', label: '플랫폼 정액(배달)', type: 'currency', defaultValue: 200, min: 0, unit: '원' }} value={values.platformFixedFeeDelivery} onChange={v => handle('platformFixedFeeDelivery', v)} />
              )}
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'royaltyRatePct', label: '로열티·브랜드사용료(%)', type: 'percent', defaultValue: 0, min: 0, max: 100, unit: '%' }} value={values.royaltyRatePct} onChange={v => handle('royaltyRatePct', v)} />
              )}
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'variableLaborPerOrder', label: '인건비 변동분(건당)', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.variableLaborPerOrder} onChange={v => handle('variableLaborPerOrder', v)} />
              )}
            </div>

            {/* Fixed costs */}
            <h3 className="text-md font-semibold text-gray-900">고정비</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <NumberInput input={{ name: 'rent', label: '임대료', type: 'currency', defaultValue: 1000000, min: 0, unit: '원' }} value={values.rent} onChange={v => handle('rent', v)} />
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'managerSalary', label: '급여(관리자)', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.managerSalary} onChange={v => handle('managerSalary', v)} />
              )}
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'employerInsurance', label: '4대보험(사업주부담)', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.employerInsurance} onChange={v => handle('employerInsurance', v)} />
              )}
              <NumberInput input={{ name: 'utilitiesBase', label: '공과금 기본요금', type: 'currency', defaultValue: 150000, min: 0, unit: '원' }} value={values.utilitiesBase} onChange={v => handle('utilitiesBase', v)} />
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'depreciation', label: '감가상각비(월 환산)', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.depreciation} onChange={v => handle('depreciation', v)} />
              )}
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'marketingFixed', label: '마케팅 고정비', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.marketingFixed} onChange={v => handle('marketingFixed', v)} />
              )}
              {mode === 'advanced' && (
                <NumberInput input={{ name: 'saasFee', label: 'SaaS/시스템 이용료', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.saasFee} onChange={v => handle('saasFee', v)} />
              )}
            </div>

            {/* Step fixed - 고급모드에서만 표시 */}
            {mode === 'advanced' && (
              <>
                <h3 className="text-md font-semibold text-gray-900">단계고정비(선택)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <NumberInput input={{ name: 'stepThresholdQ', label: '임계 Q', type: 'number', defaultValue: 3000, min: 0, unit: '건' }} value={values.stepThresholdQ} onChange={v => handle('stepThresholdQ', v)} />
                  <NumberInput input={{ name: 'stepAdditionalFixed', label: '추가 고정비', type: 'currency', defaultValue: 2000000, min: 0, unit: '원' }} value={values.stepAdditionalFixed} onChange={v => handle('stepAdditionalFixed', v)} />
                  <NumberInput input={{ name: 'expectedOrders', label: '예상 주문수(월)', type: 'number', defaultValue: 2000, min: 0, unit: '건' }} value={values.expectedOrders} onChange={v => handle('expectedOrders', v)} />
                </div>
              </>
            )}

            {/* Target profit */}
            <div className="grid md:grid-cols-2 gap-4">
              <NumberInput input={{ name: 'targetProfit', label: '목표 이익 T', type: 'currency', defaultValue: 0, min: 0, unit: '원' }} value={values.targetProfit} onChange={v => handle('targetProfit', v)} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col">
          <div className="h-8" />
          <ResultCard results={results} />
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 계산 가정 및 적용대상</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📋 적용대상</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>음식점/카페</strong>: 내점과 배달을 동시에 운영하는 업체</li>
            <li>• <strong>소매업</strong>: 온라인과 오프라인 채널을 운영하는 업체</li>
            <li>• <strong>서비스업</strong>: 다양한 채널을 통해 서비스를 제공하는 업체</li>
            <li>• <strong>제조업</strong>: 다양한 판매 채널을 가진 제조업체</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">🧮 계산 가정</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>VAT 계산</strong>: 내부 계산은 VAT 별도 기준으로 수행(VAT 포함 입력 시 가격 ÷ 1.1)</li>
            <li>• <strong>실판매가</strong>: 단가(부가세 제외) × (1 - 할인 - 프로모션 - 무료제공 - 환불)</li>
            <li>• <strong>채널별 변동비</strong>: 내점/배달 변동비를 각각 산정하고, 채널 비중으로 가중하여 평균 공헌마진 계산</li>
            <li>• <strong>단계고정비</strong>: 1차 BEP 추정치가 임계값을 넘을 경우 추가 고정비를 더해 재계산</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">📊 주요 지표 설명</h4>
          <ul className="space-y-1 text-sm text-gray-600 mb-4">
            <li>• <strong>공헌마진</strong>: 1건 판매 시 고정비 충당에 기여하는 금액(실판매가 - 채널별 변동비)</li>
            <li>• <strong>손익분기점 수량(Q_BEP)</strong>: 고정비 ÷ 가중 평균 공헌마진. 본전이 되는 최소 판매 수량</li>
            <li>• <strong>손익분기점 매출(S_BEP)</strong>: Q_BEP × 실판매가(부가세 제외)</li>
            <li>• <strong>공헌이익률(CMR)</strong>: 가중 평균 공헌마진 ÷ 실판매가. 매출 대비 공헌이익의 비율</li>
            <li>• <strong>안전여유율(MOS)</strong>: (예상매출 - BEP매출) ÷ 예상매출. 값이 클수록 더 안전한 구조</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 실제 비즈니스 환경에서는 계절성, 경쟁 상황 등 외부 요인을 고려해야 합니다</li>
            <li>• 이 계산기는 참고용이며, 실제 투자 결정은 전문가와 상담하시기 바랍니다</li>
            <li>• 고정비와 변동비의 구분이 명확하지 않은 경우 정확한 계산이 어려울 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};