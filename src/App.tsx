import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const { currentUser } = useAuth()

  return (
    <BrowserRouter>
      <div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              padding: '16px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '400',
              maxWidth: '400px',
            },
            success: {
              style: {
                background: 'linear-gradient(to bottom, #5ae176, #34c653)',
                color: '#000',
                border: '1px solid rgba(5, 223, 114, 0.3)',
                boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
              },
              iconTheme: {
                primary: '#000',
                secondary: '#5ae176',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(to bottom, #ff6b6b, #e13a3a)',
                color: '#fff',
                border: '1px solid rgba(255, 100, 103, 0.3)',
                boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ff6b6b',
              },
            },
          }}
        />
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Auth />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
