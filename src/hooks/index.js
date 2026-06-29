import { useEffect, useRef, useState, useCallback } from 'react'

// ── Polling hook ──────────────────────────────────────────
export function usePolling(fn, interval, active = true) {
  const savedFn = useRef(fn)
  useEffect(() => { savedFn.current = fn }, [fn])
  useEffect(() => {
    if (!active || !interval) return
    const id = setInterval(() => savedFn.current(), interval)
    return () => clearInterval(id)
  }, [interval, active])
}

// ── Toast hook ────────────────────────────────────────────
let _setToasts = null
export function useToastProvider() {
  const [toasts, setToasts] = useState([])
  _setToasts = setToasts
  return toasts
}

export function toast(message, type = 'info') {
  if (!_setToasts) return
  const id = Date.now() + Math.random()
  _setToasts(prev => [...prev, { id, message, type }])
  setTimeout(() => {
    _setToasts(prev => prev.filter(t => t.id !== id))
  }, 3500)
}

// ── Auth hook ─────────────────────────────────────────────
export function useAuth() {
  const [auth, setAuth] = useState({ ready: false, authenticated: false, isAdmin: false, username: '' })

  useEffect(() => {
    fetch('/api/check_admin', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAuth({ ready: true, authenticated: !!d.authenticated, isAdmin: !!d.is_admin, username: d.username || '' }))
      .catch(() => setAuth({ ready: true, authenticated: false, isAdmin: false, username: '' }))
  }, [])

  return auth
}

// ── Pagination hook ───────────────────────────────────────
export function usePagination(initialLimit = 50) {
  const [page, setPage]   = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const limit = initialLimit

  const update = useCallback((t, p) => {
    setTotal(t)
    setPages(p)
  }, [])

  return { page, setPage, total, pages, limit, update }
}
