import { useState, useEffect } from 'react'
import { api } from '../../api'
import { usePolling } from '../../hooks'
import { StatCard, Spinner } from '../../ui'

export default function StatsTab() {
  const [stats, setStats] = useState(null)

  const load = async () => {
    const d = await api.stats()
    if (d) setStats(d)
  }

  useEffect(() => { load() }, [])
  usePolling(load, 5000)

  if (!stats) return <Spinner />

  return (
    <div className="space-y-6">
      <h2 className="text-base font-semibold text-gray-800">Recognition Statistics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Scans"    value={stats.total||0}         color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard label="Recognised"     value={stats.recognised||0}    color="text-green-600"  bg="bg-green-50" />
        <StatCard label="Unrecognised"   value={stats.unrecognised||0}  color="text-red-600"    bg="bg-red-50" />
        <StatCard label="Unique People"  value={stats.unique_people||0} color="text-yellow-600" bg="bg-yellow-50" />
      </div>

      {stats.people_list?.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">People Recognised</h3>
          <div className="flex flex-wrap gap-2">
            {stats.people_list.map(n => (
              <span key={n} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.total > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recognition Rate</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${((stats.recognised / stats.total) * 100).toFixed(1)}%` }} />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-12 text-right">
              {((stats.recognised / stats.total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
