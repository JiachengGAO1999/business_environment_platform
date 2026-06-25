import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number | string
  change?: string
  icon: LucideIcon
  variant?: 'default' | 'warning' | 'danger'
}

const variantStyles = {
  default: 'bg-card/90 border-border',
  warning: 'bg-accent-amber-50 border-accent-amber-300',
  danger: 'bg-danger-50 border-danger-100',
}

const valueColors = {
  default: 'text-foreground',
  warning: 'text-accent-amber-600',
  danger: 'text-danger-700',
}

export default function KPICard({ title, value, change, icon: Icon, variant = 'default' }: KPICardProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 shadow-[0_8px_22px_rgba(47,61,51,0.05)] ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <Icon className="h-4 w-4 text-brand-600" />
      </div>
      <div className={`mt-2 text-3xl font-medium leading-none ${valueColors[variant]}`}>
        {value}
      </div>
      {change && (
        <div className="mt-1 text-xs text-muted-foreground">{change}</div>
      )}
    </div>
  )
}
