import type { ReportSection } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ReportTOCProps {
  sections: ReportSection[]
  activeSectionId: string
  onNavigate: (sectionId: string) => void
}

export default function ReportTOC({ sections, activeSectionId, onNavigate }: ReportTOCProps) {
  return (
    <div className="sticky top-14 h-[calc(100vh-3.5rem)] bg-card border-r overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="text-xs font-semibold text-gray-700">报告目录</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-7rem)]">
        <div className="p-2">
          {sections.map((section, idx) => {
            const isActive = section.id === activeSectionId
            const statusDot = section.reviewStatus === 'approved'
              ? 'bg-green-500'
              : section.reviewStatus === 'needs_revision'
              ? 'bg-amber-500'
              : section.reviewStatus === 'unsupported'
              ? 'bg-red-500'
              : 'bg-gray-300'

            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors mb-0.5 flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 font-medium'
                    : 'text-gray-600 hover:bg-background'
                }`}
              >
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${statusDot}`} />
                <span className="text-gray-400">{idx + 1}.</span>
                <span className="truncate">{section.title}</span>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
