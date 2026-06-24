import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { importRealSource } from '@/services/sourcesService'
import type { RealSourceImportResult } from '@/services/sourcesService'
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface RealSourceImporterProps {
  onSuccess?: () => void
}

export default function RealSourceImporter({ onSuccess }: RealSourceImporterProps) {
  const [url, setUrl] = useState('')
  const [country, setCountry] = useState('')
  const [text, setText] = useState('')
  const [textCountry, setTextCountry] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<RealSourceImportResult | null>(null)

  const handleUrlImport = async () => {
    if (!url.trim()) return
    setImporting(true)
    setResult(null)
    try {
      const res = await importRealSource({ url: url.trim(), country: country || undefined })
      setResult(res)
      if (res.success) {
        setUrl('')
        setCountry('')
        onSuccess?.()
      }
    } finally {
      setImporting(false)
    }
  }

  const handleTextImport = async () => {
    if (!text.trim()) return
    setImporting(true)
    setResult(null)
    try {
      const res = await importRealSource({ text: text.trim(), country: textCountry || undefined })
      setResult(res)
      if (res.success) {
        setText('')
        setTextCountry('')
        onSuccess?.()
      }
    } finally {
      setImporting(false)
    }
  }

  const statusIcon = result?.status === 'success' || result?.status === 'manual_import'
    ? <CheckCircle2 className="h-5 w-5 text-green-600" />
    : result?.status === 'partial_success'
    ? <AlertTriangle className="h-5 w-5 text-amber-600" />
    : result?.status === 'failed'
    ? <AlertCircle className="h-5 w-5 text-red-600" />
    : null

  return (
    <div className="space-y-4">
      <Tabs defaultValue="url">
        <TabsList className="w-full">
          <TabsTrigger value="url" className="flex-1 text-xs">URL 输入（模拟抓取）</TabsTrigger>
          <TabsTrigger value="text" className="flex-1 text-xs">手动粘贴文本</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3 mt-3">
          <div className="space-y-2">
            <Label className="text-xs">URL 地址</Label>
            <Input
              placeholder="https://example.com/brazil-economy-report"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">关联国家（可选）</Label>
            <Input
              placeholder="巴西 / 沙特阿拉伯 / 阿联酋"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Button
            onClick={handleUrlImport}
            disabled={importing || !url.trim()}
            size="sm"
            className="w-full text-xs"
          >
            {importing ? (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" />模拟抓取中...</>
            ) : (
              '开始模拟抓取'
            )}
          </Button>
          <p className="text-[10px] text-gray-400">
            Demo 阶段仅模拟抓取流程，不做真实网页请求。
            输入含 "blocked" 的 URL 可模拟失败，含 "partial" 可模拟部分成功。
          </p>
        </TabsContent>

        <TabsContent value="text" className="space-y-3 mt-3">
          <div className="space-y-2">
            <Label className="text-xs">粘贴文本内容</Label>
            <Textarea
              placeholder="粘贴来自网页、PDF 或文档的文本内容..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">关联国家（可选）</Label>
            <Input
              placeholder="巴西 / 沙特阿拉伯 / 阿联酋"
              value={textCountry}
              onChange={(e) => setTextCountry(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Button
            onClick={handleTextImport}
            disabled={importing || !text.trim()}
            size="sm"
            className="w-full text-xs"
          >
            {importing ? (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" />导入中...</>
            ) : (
              '导入文本'
            )}
          </Button>
          <p className="text-[10px] text-gray-400">
            系统会尝试提取标题、检测语言并进行基本文本清洗。导入后可在资料库中查看。
          </p>
        </TabsContent>
      </Tabs>

      {result && (
        <>
          <Separator />
          <div className={`rounded-lg border p-3 text-xs ${
            result.status === 'success' || result.status === 'manual_import'
              ? 'bg-green-50 border-green-200'
              : result.status === 'partial_success'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {statusIcon}
              <span className="font-medium">
                {result.status === 'success' ? '抓取成功（模拟）' :
                 result.status === 'manual_import' ? '文本导入成功' :
                 result.status === 'partial_success' ? '部分成功（模拟）' :
                 result.status === 'failed' ? '抓取失败（模拟）' : result.status}
              </span>
            </div>
            {result.errorMessage && (
              <p className="text-red-600 mt-1">{result.errorMessage}</p>
            )}
            {result.success && (
              <div className="mt-1 space-y-0.5">
                <p>标题：{result.source.title}</p>
                <p>来源：{result.source.source}</p>
                <p>状态：{result.source.fetchStatus}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
