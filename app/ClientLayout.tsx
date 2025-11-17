// app/ClientLayout.tsx (The required fix)
'use client'

// import React is not strictly needed for the <> shorthand
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/ui/toast-provider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ErrorBoundary>
        **<>**
          {children}
        **</>**
      </ErrorBoundary>
    </ToastProvider>
  )
}