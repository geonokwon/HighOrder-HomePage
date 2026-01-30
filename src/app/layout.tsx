import '@/app/globals.css';
import { ReactNode } from 'react';
import { NavBar } from '@/presentation/components/NavBar';
import { EventBanner } from '@/presentation/components/EventBanner';
import Script from 'next/script';
import { TrackingScript } from '@/shared/components/TrackingScript';
import { AnalyticsUI } from '@/shared/components/AnalyticsUI';
import { AuthProvider } from '@/shared/contexts/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-KRBR57VT');`,
          }}
        />
        {/* End Google Tag Manager */}

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

        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '897930079397589');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-KRBR57VT"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Meta Pixel (noscript) */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=897930079397589&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}

        <AuthProvider>
          <TrackingScript />
          <EventBanner />
          <NavBar />
            {children}
          <AnalyticsUI />
        </AuthProvider>
      </body>
    </html>
  );
} 