'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 클라이언트 사이드에서 즉시 로깅
  useEffect(() => {
    // 글로벌 에러 로깅
    console.error('=== GLOBAL ERROR (Client) ===');
    console.error('Error message:', error.message);
    console.error('Error digest:', error.digest);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    console.error('Error object:', error);
    console.error('============================');
  }, [error]);

  // 서버 사이드에서도 로깅 시도 (하지만 클라이언트 컴포넌트이므로 제한적)
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 직접 로깅 (하지만 이 코드는 클라이언트에서만 실행됨)
    console.error('=== GLOBAL ERROR (Server) ===');
    console.error('Error message:', error.message);
    console.error('Error digest:', error.digest);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    console.error('============================');
  }

  return (
    <html>
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <p>{error.message}</p>
          {process.env.NODE_ENV === 'development' && error.stack && (
            <pre style={{ textAlign: 'left', overflow: 'auto', maxWidth: '800px', margin: '20px auto' }}>
              {error.stack}
            </pre>
          )}
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}

