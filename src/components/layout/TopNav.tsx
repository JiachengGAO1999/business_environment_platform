import { NavLink } from 'react-router-dom'
import { Globe, LayoutDashboard, Database, Filter, FileText, ClipboardCheck } from 'lucide-react'

const navItems = [
  { to: '/', label: '工作台', icon: LayoutDashboard },
  { to: '/sources', label: '资料库', icon: Database },
  { to: '/screening', label: '智能筛选', icon: Filter },
  { to: '/reports', label: '国别报告', icon: FileText },
  { to: '/review', label: '审核中心', icon: ClipboardCheck },
]

export default function TopNav() {
  return (
    <nav className="bg-brand-900 text-white sticky top-0 z-50 border-b border-brand-800">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-accent-amber-400" />
          <span className="font-semibold text-sm tracking-wide">
            全球营商环境智能分析平台
          </span>
          <span className="text-xs text-brand-400 bg-brand-800 px-2 py-0.5 rounded">
            DEMO
          </span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-accent-amber-400 font-medium'
                    : 'text-brand-200 hover:bg-brand-800 hover:text-white'
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
