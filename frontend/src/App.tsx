import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AppShell } from '@/components/AppShell'
import { Toaster } from '@/components/ui/sonner'
import Dashboard from '@/pages/Dashboard'
import Files from '@/pages/Files'
import TestCases from '@/pages/TestCases'
import Runs from '@/pages/Runs'
import RunDetail from '@/pages/RunDetail'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/files" element={<Files />} />
            <Route path="/test-cases" element={<TestCases />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/runs/:runId" element={<RunDetail />} />
          </Routes>
        </AppShell>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App
