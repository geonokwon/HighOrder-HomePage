'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'scroll' | 'none';
}

interface InteractiveTutorialProps {
  isVisible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

// 페이지 로드 중에만 유효한 변수 (새로고침되면 초기화)
let hasShownInteractiveTutorialInThisPageLoad = false;

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ isVisible, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [elementPosition, setElementPosition] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [waitingForAction, setWaitingForAction] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "신규 UI 메뉴 선택하기",
      description: "신규 UI에서 먹고싶은 메뉴를 선택해보세요! 좌측 카테고리도 선택 가능합니다.",
      target: "[data-menu-item]",
      position: 'bottom',
      action: 'click'
    },
    {
      id: 2,
      title: "장바구니 확인",
      description: "선택한 메뉴가 우측 장바구니에 추가되었습니다! 장바구니 전체를 확인해보세요.",
      target: "[data-cart-container]",
      position: 'left',
      action: 'none'
    },
    {
      id: 3,
      title: "주문하기",
      description: "장바구니에서 주문하기 버튼을 눌러 주문을 시작해보세요!",
      target: "[data-order-submit]",
      position: 'left',
      action: 'click'
    },
    {
      id: 4,
      title: "주문 확인",
      description: "주문 확인 화면 에서 주문하기 버튼을 눌러 주문을 완료해보세요!",
      target: "[data-order-confirm-submit]",
      position: 'bottom',
      action: 'click'
    },
    {
      id: 5,
      title: "알림판 확인",
      description: "주문이 접수되었습니다! 홀 전체 주문현황을 파악할 수 있는 알림판을 확인해보세요!",
      target: "[data-notification-board]",
      position: 'right',
      action: 'none'
    },
    {
      id: 6,
      title: "POS 시스템",
      description: "주문 내역이 자동적으로 POS 시스템에 연동됩니다. 실시간으로 확인가능합니다!",
      target: "[data-pos-panel]",
      position: 'left',
      action: 'none'
    },
    {
      id: 7,
      title: "주방 프린터",
      description: "주방에도 실시간으로 주문내역이 전달됩니다.",
      target: "[data-kitchen-printer]",
      position: 'left',
      action: 'none'
    },
    {
      id: 8,
      title: "추가기능 체험",
      description: "우측 상단의 작은 추가기능 버튼을 눌러 메뉴를 열어보세요!",
      target: "#additional-features-button",
      position: 'bottom',
      action: 'click'
    },
    {
      id: 9,
      title: "이벤트 기능",
      description: "드롭다운에서 '이벤트'를 선택하면 현재 진행 중인 이벤트 정보를 확인할 수 있습니다!",
      target: "[data-additional-feature-item='event']",
      position: 'bottom',
      action: 'click'
    },
    {
      id: 10,
      title: "이벤트 페이지",
      description: "이벤트를 클릭하면 네이버 리뷰 이벤트 페이지가 표시됩니다. 전체 화면으로 이벤트 정보를 확인할 수 있습니다!",
      target: "#tablet-container",
      position: 'center',
      action: 'click'
    },
    {
      id: 11,
      title: "와이파이 선택",
      description: "드롭다운에서 '와이파이'를 선택해보세요!",
      target: "[data-additional-feature-item='wifi']",
      position: 'bottom',
      action: 'click'
    },
    {
      id: 12,
      title: "와이파이 정보",
      description: "와이파이를 클릭하면 매장의 와이파이 접속 정보를 확인할 수 있습니다!",
      target: "#tablet-container",
      position: 'center',
      action: 'click'
    },
    {
      id: 13,
      title: "홍보 영상 선택",
      description: "드롭다운에서 '홍보'를 선택해보세요!",
      target: "[data-additional-feature-item='promotion']",
      position: 'bottom',
      action: 'click'
    },
    {
      id: 14,
      title: "홍보 영상",
      description: "홍보를 클릭하면 매장의 홍보 영상을 시청할 수 있습니다! 입력이 없을시 일정시간 후 자동으로 홍보 영상이 재생됩니다.",
      target: "#tablet-container",
      position: 'center',
      action: 'click'
    },
    {
      id: 15,
      title: "테마 변경",
      description: "상단의 테마 버튼들을 눌러 다양한 색상 테마를 체험해보세요! 그레이, 레드, 다크 테마를 선택할 수 있습니다.",
      target: "[data-theme-selector]",
      position: 'bottom',
      action: 'none'
    }
  ];

  // 간단한 페이지 로드 기반 튜토리얼 표시
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 기존 localStorage 청소 (혹시 남아있을 수 있음)
      localStorage.removeItem('hasSeenTutorial');
      
      if (isVisible) {
        // 이 페이지 로드에서 아직 튜토리얼을 보지 않았다면 표시
        if (!hasShownInteractiveTutorialInThisPageLoad) {
          setShouldShow(true);
          setCurrentStep(0);
          setWaitingForAction(false);
          // 초기 장바구니 카운트 설정
          const cartButton = document.querySelector('[data-cart]');
          if (cartButton) {
            const cartText = cartButton.textContent || '';
            const match = cartText.match(/\d+/);
            setCartCount(match ? parseInt(match[0]) : 0);
          }
          hasShownInteractiveTutorialInThisPageLoad = true; // 이 페이지 로드에서 봤다고 표시
        } else {
          onComplete();
        }
      }
    }
  }, [isVisible, onComplete]);

  // 튜토리얼 중 스크롤 방지 (Demo 모달 안에서는 BottomSheetModal이 이미 처리하므로 제외)
  useEffect(() => {
    if (!shouldShow) return;

    // Demo 모달 안에서 실행되는지 확인
    const demoModal = document.querySelector('[data-demo-modal]');
    const isInsideModal = demoModal !== null;

    if (!isInsideModal) {
      // 일반 페이지인 경우에만 body 스크롤 막기
      // Demo 모달 안에서는 BottomSheetModal이 이미 body 스크롤을 막고 있음
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    // Demo 모달 안에서는 별도 처리 없음 (BottomSheetModal이 이미 처리)
  }, [shouldShow]);

  // 장바구니 변화 감지 (첫 번째 단계용) - MutationObserver 사용
  useEffect(() => {
    if (!shouldShow || currentStep !== 0 || !waitingForAction) return;
    
    const cartButton = document.querySelector('[data-cart]');
    if (!cartButton) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const cartText = cartButton.textContent || '';
          const match = cartText.match(/\d+/);
          const newCount = match ? parseInt(match[0]) : 0;
          
                  if (newCount > cartCount) {
          setWaitingForAction(false);
            setTimeout(() => {
              setCurrentStep(1);
            }, 1000); // 애니메이션이 끝난 후 다음 단계로
          }
          setCartCount(newCount);
        }
      });
    });

    observer.observe(cartButton, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [cartCount, currentStep, shouldShow, waitingForAction]);

  // 현재 단계의 타겟 요소 찾기 및 하이라이트
  useEffect(() => {
    if (!shouldShow) return;

    const findAndHighlightElement = () => {
      const currentTutorialStep = tutorialSteps[currentStep];
      if (currentTutorialStep) {
        const targetElement = document.querySelector(currentTutorialStep.target) as HTMLElement;
        
        if (targetElement) {
          // 요소가 실제로 보이는지 확인
          const isVisible = targetElement.offsetParent !== null;
          
          if (!isVisible) {
            return false; // 재시도 필요
          }

          setHighlightedElement(targetElement);

          // 정확한 위치 계산 - 여러 방법으로 검증
          const rect = targetElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          
          // 요소가 모달 내부에 있는지 확인
          const modalElement = targetElement.closest('[role="dialog"], .modal, [data-modal]') || 
                              document.querySelector('[role="dialog"], .modal, [data-modal]');
          
          let adjustedRect = rect;
          

          

          
          // viewport 기준으로 위치 설정 (스크롤 고려 안 함 - 고정 위치이므로)
          setElementPosition({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          });
          


          // 하이라이트된 요소를 클릭 가능하게 만들기
          // 추가기능 버튼과 장바구니 컨테이너의 경우 position을 변경하지 않음 (absolute 포지셔닝 유지)
          if (targetElement.id !== 'additional-features-button' && targetElement.id !== 'cart-container') {
            targetElement.style.position = 'relative';
          }
          targetElement.style.zIndex = '301';
          targetElement.style.pointerEvents = 'auto';

                    // 단계별 스크롤 제어
          setTimeout(() => {
            const isMobile = window.innerWidth < 640;
            
            // Demo 모달 안에서 실행되는지 확인
            const demoModal = document.querySelector('[data-demo-modal]');
            const modalContent = demoModal?.querySelector('[data-demo-content]') as HTMLElement;
            const isInsideModal = demoModal !== null;
            
            let scrollDelay = 0; // 스크롤 완료 대기 시간
            
            if (currentStep >= 3) { 
              // 4단계부터 (알림판, POS, 주방프린터) - 원래 방식으로 복구
              if (isMobile) {
                if (currentStep === 3) {
                  // 4단계 알림판: 중앙에 배치하여 부드러운 스크롤
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                  // 5-6단계 (POS, 주방프린터): 화면 하단쪽으로 배치
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
                scrollDelay = 600; // 스크롤 애니메이션 완료 대기
              } else {
                // 데스크탑: 중앙 배치
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                scrollDelay = 600; // 스크롤 애니메이션 완료 대기
              }
            } else if (isMobile && currentStep === 1 && isInsideModal && modalContent) {
              // 2단계 장바구니 버튼: Demo 모달 내부에서 장바구니가 잘리지 않도록 최소 스크롤
              const rect = targetElement.getBoundingClientRect();
              const modalRect = modalContent.getBoundingClientRect();
              
              // 장바구니 버튼이 모달 하단에서 잘리는지 확인
              const buttonBottom = rect.bottom;
              const modalBottom = modalRect.bottom;
              
              if (buttonBottom > modalBottom - 20) { // 20px 여유공간
                const scrollAmount = Math.min(30, buttonBottom - modalBottom + 30); // 최대 30px만 스크롤
                const currentScrollTop = modalContent.scrollTop;
                
                modalContent.scrollTo({
                  top: currentScrollTop + scrollAmount,
                  behavior: 'smooth' // 부드럽게 스크롤
                });
                scrollDelay = 300; // 스크롤 완료 대기
              }
            }
            
            // 스크롤 완료 후 툴팁 표시를 위한 추가 지연
            setTimeout(() => {
              // 위치 재계산 및 툴팁 표시 로직이 여기서 실행됨
            }, scrollDelay);
            
            // 1, 3단계는 스크롤하지 않음 (모달 초기 위치 그대로 사용)
          }, 300); // 초기 지연도 증가
          
          return true; // 성공
        }
      }
      return false;
    };

    // 모달 애니메이션을 고려한 지연 실행
    const retryWithBackoff = (attempt = 0) => {
      const success = findAndHighlightElement();
      
      if (!success && attempt < 10) {
        // 실패 시 지수 백오프로 재시도 (최대 10회)
        const delay = Math.min(100 * Math.pow(1.5, attempt), 2000);
        setTimeout(() => retryWithBackoff(attempt + 1), delay);
      }
    };

    // 모달이 완전히 열릴 때까지 기다린 후 시작
    const initialTimeout = setTimeout(() => {
      retryWithBackoff();
    }, 300); // 모달 애니메이션 시간 고려

    // 레이아웃 변화 감지
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const setupObservers = () => {
      // ResizeObserver로 요소 크기 변화 감지
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          setTimeout(() => findAndHighlightElement(), 100);
        });

        const modalElement = document.querySelector('[role="dialog"], .modal, [data-modal]');
        if (modalElement) {
          resizeObserver.observe(modalElement);
        }
      }

      // MutationObserver로 DOM 변화 감지
      mutationObserver = new MutationObserver(() => {
        setTimeout(() => findAndHighlightElement(), 100);
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    };

    // 옵저버 설정
    setTimeout(setupObservers, 500);

    // 윈도우 리사이즈 이벤트 리스너
    const handleResize = () => {
      setTimeout(() => findAndHighlightElement(), 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', handleResize);
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      
      // 스타일 복원
      if (highlightedElement) {
        // 추가기능 버튼과 장바구니 컨테이너의 경우 position을 복원하지 않음
        if (highlightedElement.id !== 'additional-features-button' && highlightedElement.id !== 'cart-container') {
          highlightedElement.style.position = '';
        }
        highlightedElement.style.zIndex = '';
        highlightedElement.style.pointerEvents = '';
      }
      setHighlightedElement(null);
    };
  }, [currentStep, shouldShow]);

  // 사용자 액션 감지
  useEffect(() => {
    if (!shouldShow || !waitingForAction) return;

    const currentTutorialStep = tutorialSteps[currentStep];
    if (!currentTutorialStep || currentTutorialStep.action === 'none') return;

          const targetElement = document.querySelector(currentTutorialStep.target) as HTMLElement;
      if (!targetElement) {
        return;
      }

    

          const handleClick = (e: Event) => {
        e.stopPropagation();
        setWaitingForAction(false);
        setTimeout(() => {
          if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            // 마지막 단계 완료 - 상태 완전 초기화
            setCurrentStep(0);
            setShouldShow(false);
            setWaitingForAction(false);
            setHighlightedElement(null);
            
            // 스크롤 복원은 useEffect의 cleanup에서 자동으로 처리됨
            
            onComplete();
          }
        }, 500); // 액션 후 잠시 대기
      };

    // 여러 이벤트에 대해 리스너 추가
    targetElement.addEventListener('click', handleClick, true); // capture phase
    targetElement.addEventListener('mousedown', handleClick, true);
    targetElement.addEventListener('touchstart', handleClick, true);
    
    return () => {
      targetElement.removeEventListener('click', handleClick, true);
      targetElement.removeEventListener('mousedown', handleClick, true);
      targetElement.removeEventListener('touchstart', handleClick, true);
    };
  }, [currentStep, shouldShow, waitingForAction, onComplete]);

  const handleNext = () => {
    const currentTutorialStep = tutorialSteps[currentStep];
    
    if (currentTutorialStep?.action === 'click') {
      // 사용자가 직접 클릭하기를 기다림
      setWaitingForAction(true);
      return;
    }

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계에서 완료 - 상태 완전 초기화
      setCurrentStep(0);
      setShouldShow(false);
      setWaitingForAction(false);
      setHighlightedElement(null);
      
      // 스크롤 복원은 useEffect의 cleanup에서 자동으로 처리됨
      
      onComplete();
    }
  };

  // 각 단계 시작 시 자동으로 waitingForAction 설정
  useEffect(() => {
    if (!shouldShow) return;
    
    const currentTutorialStep = tutorialSteps[currentStep];
    if (currentTutorialStep?.action === 'click') {
      setWaitingForAction(true);
    } else {
      setWaitingForAction(false);
    }
  }, [currentStep, shouldShow]);

  const handleSkip = () => {
    // 상태 완전 초기화
    setCurrentStep(0);
    setShouldShow(false);
    setWaitingForAction(false);
    setHighlightedElement(null);
    
    // 전역 변수도 초기화
    hasShownInteractiveTutorialInThisPageLoad = false;
    
    // 스크롤 복원은 useEffect의 cleanup에서 자동으로 처리됨
    
    onComplete();
  };

  // 오버레이가 보이지 않거나 이미 봤다면 렌더링하지 않음
  if (!isVisible || !shouldShow) {
    // 스크롤 복원은 useEffect cleanup에서 자동 처리됨
    return null;
  }

  const currentTutorialStep = tutorialSteps[currentStep];

      return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[300] pointer-events-none">
        {/* 어두운 오버레이 (하이라이트된 요소 제외) */}
        <div 
          className="fixed inset-0 bg-black/60"
          style={{
            clipPath: highlightedElement && elementPosition.width > 0 && elementPosition.height > 0
              ? `polygon(
                  0% 0%, 
                  0% 100%, 
                  ${Math.max(0, elementPosition.left - 4)}px 100%, 
                  ${Math.max(0, elementPosition.left - 4)}px ${Math.max(0, elementPosition.top - 4)}px, 
                  ${elementPosition.left + elementPosition.width + 4}px ${Math.max(0, elementPosition.top - 4)}px, 
                  ${elementPosition.left + elementPosition.width + 4}px ${elementPosition.top + elementPosition.height + 4}px, 
                  ${Math.max(0, elementPosition.left - 4)}px ${elementPosition.top + elementPosition.height + 4}px, 
                  ${Math.max(0, elementPosition.left - 4)}px 100%, 
                  100% 100%, 
                  100% 0%
                )`
              : 'none'
          }}
        />
        


        {/* 하이라이트 테두리 */}
        {highlightedElement && elementPosition.width > 0 && elementPosition.height > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed border-4 border-orange-400 rounded-lg shadow-lg z-5"
            style={{
              left: Math.max(0, elementPosition.left - 4),
              top: Math.max(0, elementPosition.top - 4),
              width: elementPosition.width + 8,
              height: elementPosition.height + 8,
              pointerEvents: 'none',
              position: 'fixed' // viewport 기준 고정 위치
            }}
          />
        )}

        {/* 튜토리얼 말풍선 */}
        {currentTutorialStep && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bg-white rounded-2xl shadow-2xl p-6 max-w-sm pointer-events-auto border border-gray-200 z-20"
            style={(() => {
              if (!highlightedElement) {
                return {
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: window.innerWidth < 640 ? '300px' : '384px'
                };
              }

              const tooltipWidth = window.innerWidth < 640 ? 300 : 384;
              const tooltipHeight = 200; // 대략적인 툴팁 높이
              const basePadding = 20;
              // 모달 내부 요소는 더 넉넉한 패딩
              const padding = currentTutorialStep.target.includes('order-submit') ? 40 : basePadding;
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;

              let left = 0;
              let top = 0;

              switch (currentTutorialStep.position) {
                case 'right':
                  if (viewportWidth < 640) {
                    // 모바일: 위쪽에 배치
                    left = Math.max(
                      padding,
                      Math.min(
                        elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                        viewportWidth - tooltipWidth - padding
                      )
                    );
                    top = Math.max(padding, elementPosition.top - tooltipHeight - 80); // 적절한 위치로 조정
                  } else {
                    // 데스크탑: 오른쪽에 배치
                    left = Math.min(
                      elementPosition.left + elementPosition.width + padding,
                      viewportWidth - tooltipWidth - padding
                    );
                    top = Math.max(
                      padding,
                      Math.min(
                        elementPosition.top + elementPosition.height / 2 - tooltipHeight / 2,
                        viewportHeight - tooltipHeight - padding
                      )
                    );
                  }
                  break;

                                 case 'left':
                   // 모달 내부 요소인 경우 특별 처리
                   const isModalElement = currentTutorialStep.target.includes('order-submit');
                   // 장바구니 버튼인지 확인
                   const isCartButton = currentTutorialStep.target.includes('data-cart');
                   
                   if (isModalElement) {
                     // 3단계 주문하기 버튼
                     if (viewportWidth < 640) {
                       // 모바일: 위쪽에 배치
                       left = Math.max(
                         padding,
                         Math.min(
                           elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                           viewportWidth - tooltipWidth - padding
                         )
                       );
                       top = Math.max(padding, elementPosition.top - tooltipHeight - 80); // 위쪽으로 배치
                     } else {
                       // 데스크탑: 왼쪽에 배치
                       left = Math.max(
                         padding,
                         elementPosition.left - tooltipWidth - 60 // 더 넉넉한 간격
                       );
                       
                       // 왼쪽 공간이 부족하면 더 왼쪽으로
                       if (left < padding) {
                         left = padding;
                       }
                       
                       // 세로 위치는 요소 중앙 맞춤
                       top = Math.max(
                         padding,
                         Math.min(
                           elementPosition.top + elementPosition.height / 2 - tooltipHeight / 2,
                           viewportHeight - tooltipHeight - padding
                         )
                       );
                     }
                   } else if (isCartButton && viewportWidth < 640) {
                     // 모바일에서 장바구니 버튼: 위쪽에 배치
                     left = Math.max(
                       padding,
                       Math.min(
                         elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                         viewportWidth - tooltipWidth - padding
                       )
                     );
                     top = Math.max(padding, elementPosition.top - tooltipHeight - 80); // 훨씬 위쪽으로 배치
                   } else {
                     // 일반 요소들 (4-6단계: POS, 주방프린터 등)
                     if (viewportWidth < 640 && currentStep >= 3) {
                       // 모바일에서 4-6단계: 위쪽에 배치
                       left = Math.max(
                         padding,
                         Math.min(
                           elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                           viewportWidth - tooltipWidth - padding
                         )
                       );
                       top = Math.max(padding, elementPosition.top - tooltipHeight - 80); // 적절한 위치로 조정
                     } else {
                       // 데스크탑 또는 1-3단계: 왼쪽에 배치
                       left = Math.max(
                         padding,
                         elementPosition.left - tooltipWidth - padding
                       );
                       
                       if (left < padding) {
                         left = Math.max(
                           padding, 
                           Math.min(
                             elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                             viewportWidth - tooltipWidth - padding
                           )
                         );
                         top = Math.max(padding, elementPosition.top - tooltipHeight - padding);
                         
                         if (top < padding) {
                           top = Math.min(
                             elementPosition.top + elementPosition.height + padding,
                             viewportHeight - tooltipHeight - padding
                           );
                         }
                       } else {
                         top = Math.max(
                           padding,
                           Math.min(
                             elementPosition.top + elementPosition.height / 2 - tooltipHeight / 2,
                             viewportHeight - tooltipHeight - padding
                           )
                         );
                       }
                     }
                   }
                   break;

                case 'top':
                  left = Math.max(
                    padding,
                    Math.min(
                      elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                      viewportWidth - tooltipWidth - padding
                    )
                  );
                  top = Math.max(padding, elementPosition.top - tooltipHeight - padding);
                  break;

                                 case 'bottom':
                 default:
                   left = Math.max(
                     padding,
                     Math.min(
                       elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2,
                       viewportWidth - tooltipWidth - padding
                     )
                   );
                   
                   // 모달 내부 요소인 경우 특별 처리
                   const isModalBottomElement = currentTutorialStep.target.includes('order-submit');
                   
                   if (isModalBottomElement) {
                     // 모달 내부 버튼은 항상 아래쪽에 충분한 공간을 두고 표시
                     const preferredTop = elementPosition.top + elementPosition.height + 60;
                     
                     // 화면 아래로 나가는지 체크
                     if (preferredTop + tooltipHeight > viewportHeight - padding) {
                       // 아래 공간이 부족하면 위쪽으로
                       top = Math.max(padding, elementPosition.top - tooltipHeight - 60);
                       
                       // 위쪽 공간도 부족하면 중앙에 배치
                       if (top < padding) {
                         top = Math.max(padding, viewportHeight / 2 - tooltipHeight / 2);
                         left = Math.max(padding, viewportWidth / 2 - tooltipWidth / 2);
                       }
                     } else {
                       top = preferredTop;
                     }
                   } else {
                     top = Math.min(
                       elementPosition.top + elementPosition.height + padding,
                       viewportHeight - tooltipHeight - padding
                     );
                   }
                   break;
              }

              return {
                left: `${Math.max(0, Math.min(left, viewportWidth - tooltipWidth))}px`,
                top: `${Math.max(0, Math.min(top, viewportHeight - tooltipHeight))}px`,
                maxWidth: `${tooltipWidth}px`
              };
            })()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => {
                // 상태 완전 초기화
                setCurrentStep(0);
                setShouldShow(false);
                setWaitingForAction(false);
                setHighlightedElement(null);
                
                // 스크롤 복원은 useEffect의 cleanup에서 자동으로 처리됨
                
                onClose();
              }}
              className="absolute top-3 right-3 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm transition-all"
            >
              ×
            </button>

            {/* 건너뛰기 버튼 */}
            <button
              onClick={handleSkip}
              className="absolute top-3 left-3 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 text-xs transition-all"
            >
              건너뛰기
            </button>

            {/* 단계 표시 */}
            <div className="text-xs text-gray-500 mb-2 text-center mt-6">
              {currentStep + 1} / {tutorialSteps.length}

            </div>

            {/* 제목 */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {currentTutorialStep.title}
            </h3>

            {/* 설명 */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {currentTutorialStep.description}
            </p>

            {/* 액션 버튼 */}
            <div className="flex justify-end items-center">

              <button
                onClick={handleNext}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-all ${
                  waitingForAction 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
                disabled={waitingForAction}
              >
                {waitingForAction 
                  ? '클릭해보세요!' 
                  : currentStep < tutorialSteps.length - 1 
                    ? '다음' 
                    : '완료'
                }
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default InteractiveTutorial; 