import { useAuth } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'

function App() {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen w-full">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Jobbigt
          </h1>
        </div>
      </header>

      <main className="py-8">
        {currentUser ? <Dashboard /> : <Auth />}
      </main>
    </div>
  )
}

export default App
