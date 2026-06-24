import type { ReactNode } from 'react'
import TopNav from './TopNav'

interface PageShellProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function PageShell({ children, title, description }: PageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="mx-auto max-w-[1440px] px-6 py-4">
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
