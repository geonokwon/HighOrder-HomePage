import '@/app/globals.css';
import { ReactNode } from 'react';
import { NavBar } from '@/presentation/components/NavBar';
import Script from 'next/script';
import { TrackingScript } from '@/shared/components/TrackingScript';
import { AnalyticsUI } from '@/shared/components/AnalyticsUI';
import { AuthProvider } from '@/shared/contexts/AuthContext';

// 정적 페이지 생성 비활성화 (빌드 타임 에러 방지)
export const dynamic = 'force-dynamic';

// ✅ 서버 에러 캡처 (런타임 서버 사이드에서만 실행)
// 빌드 타임에는 실행되지 않도록 조건 추가
if (
  typeof process !== 'undefined' &&
  process.env.NODE_ENV === 'production' &&
  typeof window === 'undefined' &&
  process.env.NEXT_RUNTIME // 런타임에만 존재
) {
  try {
    const originalConsoleError = console.error;
    console.error = function(...args: any[]) {
      originalConsoleError.apply(console, ['[SERVER ERROR]', ...args]);
    };
  } catch (e) {
    // 에러 캡처 실패 시 무시 (빌드 타임 안전성)
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>KT하이오더 - 지니원</title>
        <meta name="description" content="프리미엄 테이블오더 KT하이오더. PG수수료 Zero, 결제/주문 누락 Zero, 광고 Zero, 전국 A/S 150개소, 삼성태블릿 사용!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        {/* Open Graph 메타 태그 */}
        <meta property="og:title" content="KT하이오더 - 지니원" />
        <meta property="og:description" content="프리미엄 테이블오더 KT하이오더. PG수수료 Zero, 결제/주문 누락 Zero, 광고 Zero, 전국 A/S 150개소, 삼성태블릿 사용!" />
        <meta property="og:image" content="https://kt-highorder.kr/Link_Image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content="https://kt-highorder.kr" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="KT하이오더" />
        
        {/* Twitter Card 메타 태그 (팀즈 호환성) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KT하이오더 - 지니원" />
        <meta name="twitter:description" content="프리미엄 테이블오더 KT하이오더. PG수수료 Zero, 결제/주문 누락 Zero, 광고 Zero, 전국 A/S 150개소, 삼성태블릿 사용!" />
        <meta name="twitter:image" content="https://kt-highorder.kr/Link_Image.png" />

        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "skbgil81s8");
            `,
          }}
        />

        {/* Google tag (gtag.js) */} 
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=AW-16518566209"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16518566209');
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <TrackingScript />
          <NavBar />
            {children}
          <AnalyticsUI />
        </AuthProvider>
      </body>
    </html>
  );
} 