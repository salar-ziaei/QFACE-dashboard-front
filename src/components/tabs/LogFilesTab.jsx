import { useState, useEffect } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'
import { SectionHeader, Empty, Spinner } from '../../ui'

export default function LogFilesTab() {
  const [files,    setFiles]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [viewing,  setViewing]  = useState(null)
  const [content,  setContent]  = useState('')
  const [loadingContent, setLoadingContent] = useState(false)

  const load = async () => {
    const d = await api.logFiles()
    if (d?.success) setFiles(d.files || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const view = async file => {
    setViewing(file)
    setLoadingContent(true)
    const text = await api.logFile(file.name, 200)
    setContent(text || '')
    setLoadingContent(false)
  }

  const clearFile = async () => {
    if (!confirm(`Clear "${viewing.name}"?`)) return
    const d = await api.clearLogFile(viewing.name)
    if (d?.success) { toast('Cleared', 'success'); view(viewing); load() }
    else toast('Error', 'error')
  }

  const clearAll = async () => {
    if (!confirm('Clear all log files?')) return
    const d = await api.clearAllLogs()
    if (d?.success) { toast('All cleared', 'success'); setViewing(null); load() }
    else toast('Error', 'error')
  }

  const fmtSize = s => s < 1024 ? `${s} B` : s < 1048576 ? `${(s/1024).toFixed(1)} KB` : `${(s/1048576).toFixed(1)} MB`

  if (loading) return <Spinner />

  return (
    <div>
      <SectionHeader title="Log Files">
        <button className="btn-danger btn-sm" onClick={clearAll}>🗑 Clear All</button>
      </SectionHeader>

      {files.length === 0 ? <Empty icon="📄" text="No log files" /> : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left">File</th>
                <th className="px-3 py-2 text-left">Size</th>
                <th className="px-3 py-2 text-left">Modified</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {files.map(f => (
                <tr key={f.name} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">📄 {f.name}</td>
                  <td className="px-3 py-2 text-gray-500 text-xs">{fmtSize(f.size)}</td>
                  <td className="px-3 py-2 text-gray-500 text-xs">{new Date(f.modified).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <button className="btn-primary btn-sm" onClick={() => view(f)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <div className="mt-4 card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">📄 {viewing.name}</h3>
            <div className="flex gap-2">
              <button className="btn-primary btn-sm" onClick={() => view(viewing)}>🔄 Refresh</button>
              <button className="btn-warning btn-sm" onClick={clearFile}>🗑 Clear</button>
              <button className="btn-secondary btn-sm" onClick={() => setViewing(null)}>✕</button>
            </div>
          </div>
          {loadingContent ? (
            <div className="h-48 flex items-center justify-center text-gray-400">Loading…</div>
          ) : (
            <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-auto max-h-96 font-mono leading-relaxed">
              {content || '(empty)'}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
