import { useState, useRef } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'

export default function CameraTab() {
  const [doorLoading, setDoorLoading] = useState(false)
  const [ts, setTs] = useState(Date.now())
  const imgRef = useRef()

  const reload = () => setTs(Date.now())

  const openDoor = async () => {
    if (doorLoading) return
    setDoorLoading(true)
    try {
      const d = await api.openDoor()
      if (d?.success) toast('Door opened!', 'success')
      else toast(d?.message || 'Door failed', 'error')
    } catch { toast('Connection error', 'error') }
    finally { setDoorLoading(false) }
  }

  const streamUrl = `/api/proxy/stream?t=${ts}`

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={openDoor} disabled={doorLoading}
          className={`btn-lg ${doorLoading ? 'btn-secondary' : 'btn-success'}`}>
          {doorLoading ? '⏳ Opening…' : '🚪 Open Door'}
        </button>
        <button onClick={reload} className="btn-secondary btn-lg">🔄 Reconnect</button>
        <a href="/camera" className="btn-primary btn-lg">⛶ Fullscreen</a>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio:'4/3', maxHeight:'70vh' }}>
        <img
          ref={imgRef}
          src={`/api/proxy/stream?t=${ts}`}
          alt="Camera Feed"
          className="w-full h-full object-contain"
          onError={() => {
            setTimeout(reload, 3000)
          }}
        />
        <div className="absolute bottom-2 right-2">
          <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded">LIVE</span>
        </div>
      </div>
    </div>
  )
}
