import { useState, useEffect } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'
import { SectionHeader, Empty, Spinner, FaceImg } from '../../ui'

export default function TrainedDataTab({ isAdmin }) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const d = await api.trainedData()
    if (d?.success) setData(d.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteImg = async (person, img) => {
    if (!confirm(`Delete ${img}?`)) return
    const d = await api.deleteTrainedImage(person, img)
    if (d?.success) { toast('Deleted', 'success'); load() }
    else toast(d?.message || 'Error', 'error')
  }

  const rebuild = async () => {
    const d = await api.rebuildCache()
    if (d?.success) toast('Cache rebuilt', 'success')
    else toast('Error rebuilding cache', 'error')
  }

  if (loading) return <Spinner />

  const totalImages = data.reduce((s, p) => s + p.image_count, 0)

  return (
    <div>
      <SectionHeader title={`Trained Data — ${data.length} people, ${totalImages} images`}>
        {isAdmin && <button className="btn-primary btn-sm" onClick={rebuild}>🔄 Rebuild Cache</button>}
      </SectionHeader>

      {data.length === 0 ? <Empty icon="📚" text="No trained data" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(person => (
            <div key={person.name} className="card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-800">👤 {person.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{person.image_count} images</div>
                </div>
                {isAdmin && (
                  <button className="btn-success btn-sm"
                    onClick={() => window.location.href=`/camera?train=${encodeURIComponent(person.name)}`}>
                    📸 Train
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {person.images.slice(0, 6).map(img => (
                  <div key={img} className="relative group">
                    <FaceImg src={api.trainedImageUrl(person.name, img)} size={80} />                    {isAdmin && (
                      <button
                        onClick={() => deleteImg(person.name, img)}
                        className="absolute inset-0 bg-black/50 text-white text-lg rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                {person.image_count > 6 && (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                    +{person.image_count - 6}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
