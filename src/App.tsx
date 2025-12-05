import { useAuth } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const { currentUser } = useAuth()

  return (
    <>
      <h1>Jobbigt</h1>
      {currentUser ? <Dashboard /> : <Auth />}
    </>
  )
}

export default App
