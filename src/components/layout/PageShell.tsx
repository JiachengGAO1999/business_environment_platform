import type { ReactNode } from 'react'
import TopNav from './TopNav'

interface PageShellProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function PageShell({ children, title, description }: PageShellProps) {
  return (
    <div className="min-h-screen bg-transparent">
      <TopNav />
      <main className="mx-auto max-w-[1440px] px-5 py-6 md:px-8">
        {(title || description) && (
          <div className="mb-6 flex flex-col gap-1 border-b border-border/80 pb-5">
            {title && (
              <h1 className="text-2xl font-medium leading-tight text-foreground">{title}</h1>
            )}
            {description && (
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
