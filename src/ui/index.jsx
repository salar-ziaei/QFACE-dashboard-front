import { useToastProvider } from '../hooks'

// ── Toast container ───────────────────────────────────────
export function ToastContainer() {
  const toasts = useToastProvider()
  const colors = { success:'bg-green-500', error:'bg-red-500', info:'bg-indigo-500', warning:'bg-yellow-500' }
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`toast-enter ${colors[t.type]||colors.info} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm max-w-xs pointer-events-auto`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────
export function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null
  const start = Math.max(1, page - 2)
  const end   = Math.min(pages, page + 2)
  const btns  = []
  if (start > 1) { btns.push(1); if (start > 2) btns.push('...') }
  for (let i = start; i <= end; i++) btns.push(i)
  if (end < pages) { if (end < pages - 1) btns.push('...'); btns.push(pages) }
  return (
    <div className="flex items-center gap-1 justify-center mt-4">
      {btns.map((b, i) => b === '...'
        ? <span key={i} className="px-2 text-gray-400">…</span>
        : <button key={b} onClick={() => onPage(b)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${b === page ? 'bg-indigo-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            {b}
          </button>
      )}
    </div>
  )
}

// ── Confidence bar ────────────────────────────────────────
export function ConfBar({ value }) {
  const cls = value >= 80 ? 'conf-fill-high' : value >= 50 ? 'conf-fill-medium' : 'conf-fill-low'
  return (
    <div className="flex items-center gap-1.5">
      <div className="conf-bar w-16 flex-shrink-0"><div className={cls} style={{ width: `${Math.min(value,100)}%` }} /></div>
      <span className="text-xs text-gray-500">{value.toFixed(1)}%</span>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ recognised }) {
  return recognised
    ? <span className="badge-recognised">✅ Yes</span>
    : <span className="badge-unrecognised">❌ No</span>
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────
export function Empty({ icon='📋', text='No records found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <span className="text-5xl mb-3">{icon}</span>
      <p className="text-sm">{text}</p>
    </div>
  )
}

// ── Loading spinner ───────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )
}

// ── Section header ────────────────────────────────────────
export function SectionHeader({ title, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  )
}

// ── Face image with fallback ──────────────────────────────
export function FaceImg({ src, alt='face', size=40 }) {
  const px = `${size}px`
  return src
    ? <img src={src} alt={alt} loading="lazy"
        style={{ width:px, height:px, objectFit:'cover', borderRadius:'6px', flexShrink:0 }}
        onError={e => { e.target.style.display='none' }} />
    : <div style={{ width:px, height:px, background:'#f3f4f6', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', color:'#d1d5db', flexShrink:0 }}>?</div>
}

// ── Stat card ─────────────────────────────────────────────
export function StatCard({ label, value, color='text-indigo-600', bg='bg-indigo-50' }) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center`}>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}
