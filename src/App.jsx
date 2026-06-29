import { useState, useEffect } from 'react'
import Login     from './components/Login'
import Dashboard from './components/Dashboard'
import { useAuth } from './hooks'
import { ToastContainer } from './ui'

export default function App() {
  const auth = useAuth()
  const [session, setSession] = useState(null) // { isAdmin, username }

  useEffect(() => {
    if (auth.ready) {
      if (auth.authenticated) {
        setSession({ isAdmin: auth.isAdmin, username: auth.username })
      } else {
        setSession(null)
      }
    }
  }, [auth.ready, auth.authenticated])

  if (!auth.ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <>
        <ToastContainer />
        <Login onLogin={(isAdmin, username) => setSession({ isAdmin, username })} />
      </>
    )
  }

  return (
    <Dashboard
      isAdmin={session.isAdmin}
      username={session.username}
      onLogout={() => setSession(null)}
    />
  )
}
