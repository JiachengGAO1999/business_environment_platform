import { NavLink } from 'react-router-dom'
import { Globe2, LayoutDashboard, Database, Filter, FileText, ClipboardCheck, Map } from 'lucide-react'

const navItems = [
  { to: '/', label: '工作台', icon: LayoutDashboard },
  { to: '/world', label: '全球大屏', icon: Map },
  { to: '/sources', label: '资料库', icon: Database },
  { to: '/screening', label: '智能筛选', icon: Filter },
  { to: '/reports', label: '国别报告', icon: FileText },
  { to: '/review', label: '审核中心', icon: ClipboardCheck },
]

export default function TopNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-ivory/90 text-foreground backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-100 text-brand-800 ring-1 ring-brand-200">
            <Globe2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">
            全球营商环境智能分析平台
          </span>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            DEMO
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-900 font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
