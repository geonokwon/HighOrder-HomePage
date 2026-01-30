'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';
import LegalNoticeModal from '@/presentation/components/LegalNoticeModal';
import { AddressSearch } from '@/presentation/components/AddressSearch';

interface FormData {
  businessName: string;
  contact: string;
  address: string;
  tableCount: string;
  preferredTimeSlot: string;
  marketingConsent: boolean;
  serviceConsent: boolean;
  privacyConsent: boolean;
}

interface CheckboxProps {
  label: React.ReactNode;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface TimeSlotOption {
  label: string;
  value: string;
  isActive: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  isRequired: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface ActionSectionProps {
  hideImage?: boolean;
  hideHeader?: boolean;
  compactMode?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, required = false, checked, onChange }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
        checked
          ? 'bg-orange-500 border-orange-500 text-white'
          : 'bg-gray-200 border-gray-300 hover:border-orange-300'
      }`}
    >
      {checked && <span className="text-xs">✓</span>}
    </button>
    <label className="text-sm font-medium text-gray-700 cursor-pointer flex-1 leading-relaxed" onClick={() => onChange(!checked)}>
      <span className={`${required ? 'text-red-500' : 'text-blue-500'} whitespace-nowrap`}>
        [{required ? '필수' : '선택'}]
      </span>
      {' '}
      <span className="break-words">{label}</span>
    </label>
  </div>
);

// 로딩 스피너 컴포넌트
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
    <span className="ml-2 text-orange-500 font-medium">전송 중...</span>
  </div>
);

export const ActionSection: React.FC<ActionSectionProps> = ({ hideImage = false, hideHeader = false, compactMode = false }) => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    contact: '',
    address: '',
    tableCount: '',
    preferredTimeSlot: '',
    marketingConsent: false,
    serviceConsent: false,
    privacyConsent: false
  });
  const [openNotice, setOpenNotice] = useState<null | 'marketing' | 'service' | 'privacy'>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 폼 초기화 함수
  const resetForm = () => {
    setFormData({
      businessName: '',
      contact: '',
      address: '',
      tableCount: '',
      preferredTimeSlot: '',
      marketingConsent: false,
      serviceConsent: false,
      privacyConsent: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacyConsent) {
      alert('필수 개인정보 수집·이용 동의를 체크해주세요.');
      return;
    }
    
    if (!formData.businessName || !formData.contact || !formData.address || !formData.tableCount || !formData.preferredTimeSlot) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    // 폼 제출 로직: 이메일 전송 API 호출
    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.ok) {
        alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        resetForm(); // 폼 초기화
      } else {
        alert('메일 전송에 실패했습니다: ' + result.error);
      }
    } catch (err) {
      alert('메일 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 연락처 인풋 핸들러: 숫자만, 11자리 제한, 자동 하이픈
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = value.slice(0, 11);
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    } else if (value.length > 7) {
      formatted = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    }
    setFormData(prev => ({ ...prev, contact: formatted }));
  };

  return (
    <>
      <AnimatedSection className={`w-full ${compactMode ? 'py-6' : 'py-16'} bg-transparent`}>
        <div className={`max-w-3xl mx-auto px-4 ${compactMode ? 'pt-10 pb-2' : ''}`}>
          {/* CTA 캐릭터 이미지 */}
          {!hideImage && (
            <AnimatedItem className="text-center mb-24">
              <Image
                src="/CTA/CTA_Character.png"
                alt="KT 하이오더 캐릭터"
                width={1031 / 1.5}
                height={467 / 1.5}
                className="mx-auto"
                priority
              />
            </AnimatedItem>
          )}
          {/* 섹션 헤더 */}
          {(!hideHeader) && (
            <AnimatedItem className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-4">
                신규 설치 상담
              </h2>
              <p className="text-lg md:text-xl font-bold text-gray-700">
                사장님 매장 상황에 꼭 맞는 상담을 도와드립니다.
              </p>
            </AnimatedItem>
          )}
          
          {/* 상담 신청 폼 */}
          <AnimatedContainer>
            <form onSubmit={handleSubmit} className={`${compactMode ? 'space-y-3' : 'space-y-6'} ${compactMode ? 'max-h-[70vh] overflow-y-auto' : ''}`}>
            {/* 상호명 or 성명 */}
              <AnimatedItem>
                <div className="bg-gray-100 rounded-xl p-6">
                  <label className="text-lg font-bold text-gray-700 block mb-3">
                    상호명 or 성명
                  </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="상호명 또는 성명을 입력해주세요"
                className="w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
            </div>
              </AnimatedItem>
            {/* 연락처 */}
              <AnimatedItem>
                <div className="bg-gray-100 rounded-xl p-6">
                  <label className="text-lg font-bold text-gray-700 block mb-3">
                    연락처
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={formData.contact}
                    onChange={handleContactChange}
                    placeholder="연락 가능한 전화번호를 입력해주세요"
                    className="w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength={13} // 000-0000-0000 (13자)
                    disabled={isLoading}
                  />
                </div>
              </AnimatedItem>
            
            {/* 주소 */}
              <AnimatedItem>
                <div className="bg-gray-100 rounded-xl p-6">
                  <label className="text-lg font-bold text-gray-700 block mb-3">
                    주소
                  </label>
                  <AddressSearch
                    onAddressSelect={(address) => setFormData(prev => ({ ...prev, address }))}
                    placeholder="주소를 입력하거나 주소 찾기를 클릭하세요"
                    value={formData.address}
                    disabled={isLoading}
                  />
                </div>
              </AnimatedItem>
            
            {/* 테이블 개수 및 희망 시간대 */}
              <AnimatedItem>
                <div className="bg-gray-100 rounded-xl p-6">
                  <label className="text-lg font-bold text-gray-700 block mb-3">
                    테이블 개수 및 희망 시간대
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* 테이블 개수 */}
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        테이블 개수
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={formData.tableCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, tableCount: e.target.value }))}
                          placeholder="테이블 개수를 입력해주세요"
                          min="1"
                          className="w-full p-3 pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          disabled={isLoading}
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">개</span>
                      </div>
                    </div>
                    
                    {/* 희망 시간대 */}
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        희망 시간대
                      </label>
                      <select
                        value={formData.preferredTimeSlot}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTimeSlot: e.target.value }))}
                        className="w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        disabled={isLoading}
                      >
                        <option value="">시간대를 선택해주세요</option>
                        <option value="anytime">언제든 상관없음</option>
                        <option value="morning1">오전 (09:00 - 10:00)</option>
                        <option value="morning2">오전 (10:00 - 11:00)</option>
                        <option value="morning3">오전 (11:00 - 12:00)</option>
                        <option value="afternoon1">오후 (13:00 - 14:00)</option>
                        <option value="afternoon2">오후 (14:00 - 15:00)</option>
                        <option value="afternoon3">오후 (15:00 - 16:00)</option>
                        <option value="afternoon4">오후 (16:00 - 17:00)</option>
                        <option value="afternoon5">오후 (17:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            
            {/* 동의 체크박스들 */}
              <AnimatedItem>
                <div className="space-y-4">
                  <Checkbox
                    label={
                      <>
                        광고성 정보 수신 동의
                        <button
                          type="button"
                          className="ml-2 underline text-blue-600 text-xs"
                          onClick={() => setOpenNotice('marketing')}
                          disabled={isLoading}
                        >
                          [법적 고지사항 보기]
                        </button>
                      </>
                    }
                    checked={formData.marketingConsent}
                    onChange={(checked) => setFormData(prev => ({ ...prev, marketingConsent: checked }))}
                  />
                
                  <Checkbox
                    label={
                      <>
                        서비스/이벤트 정보 제공을 위한 개인정보 수집·이용 동의
                        <button
                          type="button"
                          className="ml-2 underline text-blue-600 text-xs"
                          onClick={() => setOpenNotice('service')}
                          disabled={isLoading}
                        >
                          [법적 고지사항 보기]
                        </button>
                      </>
                    }
                    checked={formData.serviceConsent}
                    onChange={(checked) => setFormData(prev => ({ ...prev, serviceConsent: checked }))}
                  />
                
                  <Checkbox
                    label={
                      <>
                        개인정보 수집·이용 동의
                        <button
                          type="button"
                          className="ml-2 underline text-blue-600 text-xs"
                          onClick={() => setOpenNotice('privacy')}
                          disabled={isLoading}
                        >
                          [법적 고지사항 보기]
                        </button>
                      </>
                    }
                    required
                    checked={formData.privacyConsent}
                    onChange={(checked) => setFormData(prev => ({ ...prev, privacyConsent: checked }))}
                  />
                </div>
              </AnimatedItem>
            
            {/* 제출 버튼 */}
              <AnimatedItem>
                <div className="text-center pt-6 overflow-x-hidden">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 transform hover:scale-102 shadow-xl ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? <LoadingSpinner /> : '무료 상담 신청하기'}
                  </button>
                </div>
              </AnimatedItem>
            </form>
          </AnimatedContainer>
        </div>
      </AnimatedSection>
      <LegalNoticeModal open={!!openNotice} onClose={() => setOpenNotice(null)}>
        {openNotice === 'marketing' && (
          <>
            <h2 className="text-lg font-bold mb-2">광고성 정보 수신 동의 고지</h2>
            <p>
              지니원 회사는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조 및 제66조에 따라, 전자적 전송매체(문자, 이메일, 앱 푸시 등)를 통해 광고성 정보를 전송하기 위해 귀하의 동의를 받고자 합니다.<br/>
              <br/>
              1. 수신 항목<br/>
              - 문자(SMS/LMS/MMS), 이메일, 알림톡, 카카오채널 메시지, 앱 푸시 등<br/>
              <br/>
              2. 수신 목적<br/>
              - 신규 서비스 및 이벤트 안내<br/>
              - 할인 혜택 및 프로모션 정보 제공<br/>
              - 맞춤형 마케팅 정보 안내<br/>
              <br/>
              3. 보유 및 이용 기간<br/>
              - 동의일로부터 회원 탈퇴 또는 동의 철회 시까지<br/>
              <br/>
              4. 동의 거부 시 불이익<br/>
              - 수신 동의는 선택사항이며, 거부하셔도 서비스 이용에는 제한이 없습니다. 단, 최신 혜택 및 정보 안내를 받으실 수 없습니다.<br/>
              <br/>
              ※ 귀하는 언제든지 수신 동의를 철회하실 수 있으며, 수신 거부 방법은 발송되는 메시지 내에 명시됩니다.
            </p>
          </>
        )}
        {openNotice === 'service' && (
          <>
            <h2 className="text-lg font-bold mb-2">서비스/이벤트 정보 제공 동의 고지</h2>
            <p>
              지니원 회사는 이용자에게 다양한 혜택 및 맞춤형 서비스를 제공하고자 아래와 같이 귀하의 정보 이용에 대한 동의를 받고자 합니다.<br/>
              <br/>
              1. 수신 항목<br/>
              - 문자, 이메일, 앱 푸시, 카카오채널 등<br/>
              <br/>
              2. 수신 목적<br/>
              - 서비스 관련 공지사항, 운영 안내<br/>
              - 이벤트, 설문조사, 고객만족도 조사<br/>
              - 신규 기능 또는 프로모션 정보 제공<br/>
              <br/>
              3. 보유 및 이용 기간<br/>
              - 동의일로부터 회원 탈퇴 또는 동의 철회 시까지<br/>
              <br/> 
              4. 동의 거부 시 불이익<br/>
              - 수신 동의는 선택사항이며, 거부하셔도 기본 서비스 이용에는 제한이 없습니다. 단, 일부 이벤트 참여 및 알림 제공이 제한될 수 있습니다.<br/>
            </p>
          </>
        )}
        {openNotice === 'privacy' && (
          <>
            <h2 className="text-lg font-bold mb-2">개인정보 수집·이용 동의 고지</h2>
            <p>
              지니원 회사는 「개인정보 보호법」 제15조 및 제17조에 따라 아래와 같이 귀하의 개인정보를 수집·이용하고자 합니다.<br/>
              <br/>
              1. 수집 항목<br/>
              - 필수: 이름, 연락처(휴대폰 번호), 이메일<br/>
              - 선택: 생년월일, 성별, 주소 등<br/>
              <br/>
              2. 수집 목적<br/>
              - 서비스 제공 및 본인 확인<br/>
              - 고객 상담 및 민원 처리<br/>
              - 이벤트 참여 및 경품 배송<br/>
              - 마케팅 및 광고성 정보 제공 (수신 동의한 경우에 한함)<br/>
              <br/>
              3. 보유 및 이용 기간<br/>
              - 수집일로부터 회원 탈퇴 또는 목적 달성 시까지 (단, 관련 법령에 따라 보존이 필요한 경우 그에 따름)<br/>
              <br/>
              4. 동의 거부 시 불이익<br/>
              - 개인정보 수집·이용에 대한 동의는 필수입니다. 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.<br/>
              <br/>
              ※ 자세한 내용은 개인정보처리방침에서 확인하실 수 있습니다.
            </p>
          </>
        )}
      </LegalNoticeModal>
    </>
  );
}; 