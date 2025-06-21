import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { SupabaseProvider } from './contexts/SupabaseContext'
import { ThemeProvider } from './hooks/useTheme'
import { Toaster } from './components/ui/toaster'
import CMSApp from './CMSApp'
import './index.css'
import { initErrorTracking } from './lib/errorTracking'

// Initialize error tracking
initErrorTracking()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SupabaseProvider>
          <AuthProvider>
            <ThemeProvider>
              <CMSApp />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
) 