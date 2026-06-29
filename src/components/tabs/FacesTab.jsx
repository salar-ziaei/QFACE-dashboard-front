import { useState, useEffect } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'
import { SectionHeader, Empty, Spinner, Modal } from '../../ui'

export default function FacesTab({ isAdmin }) {
  const [faces,   setFaces]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState({ name:'', start_time:'00:00', end_time:'23:59' })
  const [editModal, setEditModal] = useState(null)
  const [editForm,  setEditForm]  = useState({ start_time:'00:00', end_time:'23:59' })

  const load = async () => {
    const d = await api.faces()
    if (d?.success) setFaces(d.faces || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name.trim()) { toast('Name required', 'error'); return }
    const d = await api.createFace(form)
    if (d?.success) { toast('Face created', 'success'); setModal(false); setForm({ name:'', start_time:'00:00', end_time:'23:59' }); load() }
    else toast(d?.message || 'Error', 'error')
  }

  const remove = async name => {
    if (!confirm(`Delete "${name}" and all images?`)) return
    const d = await api.deleteFace(name)
    if (d?.success) { toast('Deleted', 'success'); load() }
    else toast(d?.message || 'Error', 'error')
  }

  const openEdit = f => { setEditModal(f); setEditForm({ start_time: f.entry_start_time, end_time: f.entry_end_time }) }

  const saveEdit = async () => {
    const d = await api.updateFace(editModal.name, editForm)
    if (d?.success) { toast('Updated', 'success'); setEditModal(null); load() }
    else toast(d?.message || 'Error', 'error')
  }

  if (loading) return <Spinner />

  return (
    <div>
      <SectionHeader title={`Faces (${faces.length})`}>
        {isAdmin && <button className="btn-primary" onClick={() => setModal(true)}>+ Add Face</button>}
      </SectionHeader>

      {faces.length === 0 ? <Empty icon="👤" text="No faces in database" /> : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Allowed Hours</th>
                <th className="px-3 py-2 text-left">Images</th>
                {isAdmin && <th className="px-3 py-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faces.map(f => (
                <tr key={f.name} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{f.name}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{f.entry_start_time} – {f.entry_end_time}</td>
                  <td className="px-3 py-2 text-gray-600">{f.image_count || 0}</td>
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button className="btn-success btn-sm" onClick={() => window.location.href=`/camera?train=${encodeURIComponent(f.name)}`}>📸 Train</button>
                        <button className="btn-primary btn-sm" onClick={() => openEdit(f)}>✏️</button>
                        <button className="btn-danger btn-sm" onClick={() => remove(f.name)}>🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add face modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add Face">
        <div className="space-y-3">
          <div><label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Person name" autoFocus /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">From</label>
              <input type="time" className="input" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} /></div>
            <div><label className="label">To</label>
              <input type="time" className="input" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})} /></div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={create}>Create</button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit ${editModal?.name}`}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">From</label>
              <input type="time" className="input" value={editForm.start_time} onChange={e=>setEditForm({...editForm,start_time:e.target.value})} /></div>
            <div><label className="label">To</label>
              <input type="time" className="input" value={editForm.end_time} onChange={e=>setEditForm({...editForm,end_time:e.target.value})} /></div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button className="btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={saveEdit}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
