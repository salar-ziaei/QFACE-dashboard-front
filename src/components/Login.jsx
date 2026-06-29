import { useState } from 'react'
import { api } from '../api'
import { toast } from '../hooks'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)

  const submit = async e => {
    e.preventDefault()
    if (!username || !password) { toast('Fill all fields', 'error'); return }
    setLoading(true)
    try {
      const d = await api.login(username, password, remember)
      if (d?.success) { onLogin(d.is_admin, username) }
      else toast(d?.message || 'Invalid credentials', 'error')
    } catch { toast('Connection error', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">QFACE</h1>
          <p className="text-gray-500 text-sm mt-1">Face Recognition Access Control</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input className="input" type="text" value={username}
              onChange={e => setUsername(e.target.value)} placeholder="Enter username" autoFocus />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              className="rounded border-gray-300 text-indigo-500" />
            Remember me (30 days)
          </label>
          <button type="submit" disabled={loading}
            className="btn-primary w-full py-2.5 text-base justify-center">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
