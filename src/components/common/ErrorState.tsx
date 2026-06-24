import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message = '加载失败，请重试', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <AlertTriangle className="h-12 w-12 mb-3 text-amber-500" />
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4 mr-1" />
          重试
        </Button>
      )}
    </div>
  )
}
