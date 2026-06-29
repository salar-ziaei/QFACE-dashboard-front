import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../../api'
import { toast, usePolling, usePagination } from '../../hooks'
import { Pagination, ConfBar, Badge, Empty, Spinner, SectionHeader, FaceImg, Modal } from '../../ui'

function LogRow({ entry, isAdmin, onDelete, onMove }) {
  const isRec = entry.is_recognised === 1 || entry.is_recognised === true
  const pred  = entry.prediction || 'Unknown'
  const imgSrc = api.logImageUrl(pred, entry.filename, isRec)
  const time  = (entry.date || entry.timestamp || '').replace('T',' ').slice(0,19)

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2">
        <FaceImg src={imgSrc} size={48} />
      </td>
      <td className="px-3 py-2 font-medium text-gray-800">{pred}</td>
      <td className="px-3 py-2"><ConfBar value={entry.confidence||0} /></td>
      <td className="px-3 py-2"><Badge recognised={isRec} /></td>
      <td className="px-3 py-2 text-xs text-gray-500">{time}</td>
      {isAdmin && (
        <td className="px-3 py-2">
          <div className="flex gap-1">
            <button className="btn-success btn-sm" onClick={() => onMove(entry, isRec)}>📁</button>
            <button className="btn-danger btn-sm" onClick={() => onDelete(entry.id)}>✕</button>
          </div>
        </td>
      )}
    </tr>
  )
}

export default function LogsTab({ type = 'all', isAdmin }) {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [moveModal, setMoveModal] = useState(null)
  const [moveName,  setMoveName]  = useState('')
  const lastIdRef = useRef(0)
  const pag = usePagination(50)

  const tab = type // 'all' | 'recognised' | 'unrecognised'

  const load = useCallback(async (page = 1, incremental = false) => {
    try {
      const params = { tab, search, limit: 50, offset: (page-1)*50 }
      if (incremental && lastIdRef.current > 0) params.last_id = lastIdRef.current
      const d = await api.logs(params)
      if (!d?.success) return
      if (incremental) {
        if (d.logs?.length > 0) {
          setLogs(prev => [...d.logs, ...prev].slice(0, 50))
          lastIdRef.current = d.logs[0].id
        }
        return
      } else {
        setLogs(d.logs || [])
        if (d.logs?.length > 0) lastIdRef.current = d.logs[0].id
        pag.update(d.total||0, d.pages||1)
        pag.setPage(page)
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }, [tab, search, pag.update])

  useEffect(() => { lastIdRef.current = 0; setLoading(true); load(1, false) }, [tab, search])
  const pageRef = useRef(1)
  useEffect(() => { pageRef.current = pag.page }, [pag.page])
  usePolling(() => load(pageRef.current, true), 3000)

  const handleDelete = async id => {
    if (!confirm('Delete this log?')) return
    const d = await api.deleteLog(id)
    if (d?.success) { toast('Deleted', 'success'); load(pag.page, false) }
    else toast(d?.message || 'Error', 'error')
  }

  const handleMove = (entry, isRec) => {
    setMoveModal(entry)
    setMoveName(isRec ? entry.prediction : '')
  }

  const confirmMove = async () => {
    if (!moveName.trim()) { toast('Enter a name', 'error'); return }
    const d = await api.moveToDb(moveModal.id, moveName.trim())
    if (d?.success) { toast('Moved to database', 'success'); setMoveModal(null); load(pag.page, false) }
    else toast(d?.message || 'Error', 'error')
  }

  const handleClear = async () => {
    if (!confirm('Clear ALL logs? Cannot be undone!')) return
    const d = await api.clearLogs()
    if (d?.success) { toast('Cleared', 'success'); load(1, false) }
    else toast(d?.message || 'Error', 'error')
  }

  const title = tab === 'all' ? 'All Logs' : tab === 'recognised' ? 'Recognised' : 'Unrecognised'

  return (
    <div>
      <SectionHeader title={title}>
        <input className="input w-48" placeholder="Search…" value={search}
          onChange={e => setSearch(e.target.value)} />
        {isAdmin && <button className="btn-danger btn-sm" onClick={handleClear}>🗑 Clear All</button>}
      </SectionHeader>

      {loading ? <Spinner /> : logs.length === 0 ? <Empty /> : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Confidence</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Time</th>
                {isAdmin && <th className="px-3 py-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(e => (
                <LogRow key={e.id} entry={e} isAdmin={isAdmin}
                  onDelete={handleDelete} onMove={handleMove} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={pag.page} pages={pag.pages} onPage={p => load(p, false)} />

      <Modal open={!!moveModal} onClose={() => setMoveModal(null)} title="Move to Training Database">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Enter the person's name to save this image for training.</p>
          <div>
            <label className="label">Name</label>
            <input className="input" value={moveName} onChange={e => setMoveName(e.target.value)}
              placeholder="Person name" autoFocus />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setMoveModal(null)}>Cancel</button>
            <button className="btn-success" onClick={confirmMove}>Move</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
