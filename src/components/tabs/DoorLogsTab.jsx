import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'
import { usePolling, usePagination } from '../../hooks'
import { Pagination, Empty, Spinner, SectionHeader } from '../../ui'

export default function DoorLogsTab() {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const pag = usePagination(50)

  const load = useCallback(async (page = 1) => {
    const d = await api.doorLogs({ page, limit: 50, search })
    if (d?.success) {
      setLogs(d.logs || [])
      pag.update(d.total || 0, d.pages || 1)
      pag.setPage(page)
    }
    setLoading(false)
  }, [search])

  useEffect(() => { setLoading(true); load(1) }, [search])
  usePolling(() => load(pag.page), 3000)

  if (loading) return <Spinner />

  return (
    <div>
      <SectionHeader title="Door Logs">
        <input className="input w-48" placeholder="Search…" value={search}
          onChange={e => setSearch(e.target.value)} />
      </SectionHeader>

      {logs.length === 0 ? <Empty icon="🚪" text="No door events yet" /> : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left">Person</th>
                <th className="px-3 py-2 text-left">Action</th>
                <th className="px-3 py-2 text-left">Result</th>
                <th className="px-3 py-2 text-left">Confidence</th>
                <th className="px-3 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{log.person || 'Unknown'}</td>
                  <td className="px-3 py-2 text-gray-600">{log.action || 'door_open'}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                      ${log.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-xs">
                    {log.confidence != null ? `${log.confidence.toFixed(1)}%` : '—'}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {(log.timestamp || '').replace('T', ' ').slice(0, 19)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={pag.page} pages={pag.pages} onPage={p => load(p)} />
    </div>
  )
}
