import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  fullPage?: boolean
}

export default function LoadingState({ message = '加载中...', fullPage = false }: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-gray-400 ${
        fullPage ? 'h-64' : 'py-16'
      }`}
    >
      <Loader2 className="h-8 w-8 animate-spin mb-3 text-brand-600" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
