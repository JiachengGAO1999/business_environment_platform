import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const SourcesPage = lazy(() => import('@/pages/SourcesPage'))
const ScreeningPage = lazy(() => import('@/pages/ScreeningPage'))
const ReportsListPage = lazy(() => import('@/pages/ReportsListPage'))
const ReportDetailPage = lazy(() => import('@/pages/ReportDetailPage'))
const ReviewPage = lazy(() => import('@/pages/ReviewPage'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen text-muted-foreground">
          加载中...
        </div>
      }>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/screening" element={<ScreeningPage />} />
          <Route path="/reports" element={<ReportsListPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
