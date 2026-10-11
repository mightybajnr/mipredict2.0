import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#151B18',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.875rem',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);