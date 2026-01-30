'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('🔥 PAGE ERROR:', error)
    console.error('Error message:', error.message)
    console.error('Error digest:', error.digest)
    if (error.stack) {
      console.error('Error stack:', error.stack)
    }
  }, [error])

  // 서버 사이드에서도 로깅 (서버 컴포넌트가 아니지만 시도)
  if (typeof window === 'undefined') {
    console.error('[SERVER] 🔥 PAGE ERROR:', error)
    console.error('[SERVER] Error message:', error.message)
    console.error('[SERVER] Error digest:', error.digest)
    if (error.stack) {
      console.error('[SERVER] Error stack:', error.stack)
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Page Error!</h2>
      <pre style={{ textAlign: 'left', overflow: 'auto', maxWidth: '800px', margin: '20px auto' }}>
        {error.message}
        {error.stack && (
          <>
            {'\n\n'}
            {error.stack}
          </>
        )}
      </pre>
      <button onClick={reset} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Try again
      </button>
    </div>
  )
}
