import { useState, useEffect } from 'react'
import { auth, db } from './firebase/config'
import './App.css'

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...')

  useEffect(() => {
    // Check if Firebase is initialized
    try {
      const authCheck = auth.app.name ? '✅ Auth' : '❌ Auth'
      const dbCheck = db.app.name ? '✅ Firestore' : '❌ Firestore'
      setFirebaseStatus(`Firebase Connected: ${authCheck} | ${dbCheck}`)
    } catch (error) {
      setFirebaseStatus(`❌ Firebase Error: ${error}`)
    }
  }, [])

  return (
    <>
      <h1>Jobbigt</h1>
      <div className="card">
        <p style={{ color: firebaseStatus.includes('✅') ? '#4ade80' : '#f87171' }}>
          {firebaseStatus}
        </p>
        <p>
          Firebase is configured with project: <strong>jobbigt-ba673</strong>
        </p>
      </div>
    </>
  )
}

export default App
