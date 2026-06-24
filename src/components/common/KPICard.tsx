import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number | string
  change?: string
  icon: LucideIcon
  variant?: 'default' | 'warning' | 'danger'
}

const variantStyles = {
  default: 'bg-white border-gray-200',
  warning: 'bg-amber-50 border-amber-300',
  danger: 'bg-red-50 border-red-300',
}

const valueColors = {
  default: 'text-gray-900',
  warning: 'text-amber-700',
  danger: 'text-red-700',
}

export default function KPICard({ title, value, change, icon: Icon, variant = 'default' }: KPICardProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </span>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className={`mt-2 text-2xl font-bold ${valueColors[variant]}`}>
        {value}
      </div>
      {change && (
        <div className="mt-1 text-xs text-gray-500">{change}</div>
      )}
    </div>
  )
}
