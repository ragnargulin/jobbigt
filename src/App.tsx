import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const { currentUser } = useAuth()

  return (
    <BrowserRouter>
      <div>
        <header className="border-b p-4">
          <h1 className="text-2xl font-bold">Jobbigt</h1>
        </header>

        <main>
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
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
