import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { exportReport } from '@/services/reportService'
import { Download, Copy, Check, Loader2 } from 'lucide-react'

interface ReportExporterProps {
  reportId: string
  reportTitle: string
}

export default function ReportExporter({ reportId, reportTitle }: ReportExporterProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<'markdown' | 'html'>('markdown')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExport = async (fmt: 'markdown' | 'html') => {
    setFormat(fmt)
    setLoading(true)
    try {
      const result = await exportReport(reportId, fmt)
      setContent(result)
    } catch {
      setContent('导出失败，请重试。')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpen = () => {
    setOpen(true)
    setContent('')
    setLoading(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen} className="text-xs h-7">
        <Download className="h-3 w-3 mr-1" />导出报告
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">导出报告：{reportTitle}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={format === 'markdown' ? 'default' : 'outline'}
                onClick={() => handleExport('markdown')}
                disabled={loading}
                className="text-xs h-7"
              >
                Markdown
              </Button>
              <Button
                size="sm"
                variant={format === 'html' ? 'default' : 'outline'}
                onClick={() => handleExport('html')}
                disabled={loading}
                className="text-xs h-7"
              >
                HTML
              </Button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />生成中...
              </div>
            )}

            {content && !loading && (
              <>
                <Textarea
                  value={content}
                  readOnly
                  className="min-h-[300px] text-xs font-mono"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Demo 阶段：内容已生成，可复制使用。文件下载功能后续接入。
                  </span>
                  <Button size="sm" onClick={handleCopy} className="text-xs h-7">
                    {copied ? (
                      <><Check className="h-3 w-3 mr-1" />已复制</>
                    ) : (
                      <><Copy className="h-3 w-3 mr-1" />复制内容</>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
