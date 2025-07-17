import { useState, useEffect } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { Dashboard } from '@/components/pages/Dashboard'
import { AnalysisResults } from '@/components/pages/AnalysisResults'
import { History } from '@/components/pages/History'
import { Settings } from '@/components/pages/Settings'
import { Integrations } from '@/components/pages/Integrations'
import { Toaster } from '@/components/ui/toaster'
import { blink } from '@/blink/client'

type Page = 'dashboard' | 'analysis' | 'history' | 'settings' | 'integrations'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [analysisData, setAnalysisData] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onAnalyze={(data) => {
          setAnalysisData(data)
          setCurrentPage('analysis')
        }} />
      case 'analysis':
        return <AnalysisResults data={analysisData} />
      case 'history':
        return <History />
      case 'settings':
        return <Settings />
      case 'integrations':
        return <Integrations />
      default:
        return <Dashboard onAnalyze={(data) => {
          setAnalysisData(data)
          setCurrentPage('analysis')
        }} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">SEOSE Analyzer Dashboard</h2>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <div className="h-4 w-4 text-primary-foreground">⚡</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">SEOSE Analyzer Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Analyze and optimize your website's SEO performance with comprehensive insights, 
            competitor analysis, and actionable recommendations.
          </p>
          <button 
            onClick={() => blink.auth.login()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Get Started
          </button>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-xs text-muted-foreground">SEO Metrics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-xs text-muted-foreground">Analyses</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          <main className="flex-1 p-6">
            {renderPage()}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}

export default App