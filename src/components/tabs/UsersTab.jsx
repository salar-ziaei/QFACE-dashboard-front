import { useState, useEffect } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'
import { SectionHeader, Empty, Spinner, Modal } from '../../ui'

export default function UsersTab() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [form, setForm] = useState({ username:'', password:'', isAdmin:0, startTime:'00:00', endTime:'23:59' })
  const [editForm, setEditForm] = useState({ startTime:'00:00', endTime:'23:59', isAdmin:0 })

  const load = async () => {
    const d = await api.users()
    if (d?.success) setUsers(d.users || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.username || !form.password) { toast('Username and password required', 'error'); return }
    const d = await api.addUser(form)
    if (d?.success) { toast(`User ${form.username} added`, 'success'); setModal(false); setForm({ username:'', password:'', isAdmin:0, startTime:'00:00', endTime:'23:59' }); load() }
    else toast(d?.message || 'Error', 'error')
  }

  const remove = async username => {
    if (!confirm(`Delete "${username}"?`)) return
    const d = await api.deleteUser(username)
    if (d?.success) { toast('Deleted', 'success'); load() }
    else toast(d?.message || 'Error', 'error')
  }

  const openEdit = u => {
    setEditModal(u)
    setEditForm({ startTime: u.entry_start_time, endTime: u.entry_end_time, isAdmin: u.is_admin })
  }

  const saveEdit = async () => {
    const d = await api.updateUser({ username: editModal.username, ...editForm })
    if (d?.success) { toast('Updated', 'success'); setEditModal(null); load() }
    else toast(d?.message || 'Error', 'error')
  }

  if (loading) return <Spinner />

  return (
    <div>
      <SectionHeader title={`Users (${users.length})`}>
        <button className="btn-primary" onClick={() => setModal(true)}>+ Add User</button>
      </SectionHeader>

      {users.length === 0 ? <Empty icon="👥" text="No users" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map(u => (
            <div key={u.username} className="card flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    {u.is_admin ? '👑' : '👤'} {u.username}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{u.is_admin ? 'Admin' : 'User'}</div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <div>{u.entry_start_time} –</div>
                  <div>{u.entry_end_time}</div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button className="btn-success btn-sm"
                  onClick={() => window.location.href=`/camera?train=${encodeURIComponent(u.username)}`}>
                  📸 Train
                </button>
                <button className="btn-primary btn-sm" onClick={() => openEdit(u)}>✏️ Edit</button>
                {u.username !== 'admin' && (
                  <button className="btn-danger btn-sm" onClick={() => remove(u.username)}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add user modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add User">
        <div className="space-y-3">
          <div><label className="label">Username</label>
            <input className="input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} autoFocus /></div>
          <div><label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">From</label>
              <input type="time" className="input" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} /></div>
            <div><label className="label">To</label>
              <input type="time" className="input" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} /></div>
          </div>
          <div><label className="label">Role</label>
            <select className="input" value={form.isAdmin} onChange={e=>setForm({...form,isAdmin:parseInt(e.target.value)})}>
              <option value={0}>User</option>
              <option value={1}>Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={add}>Add</button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit ${editModal?.username}`}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">From</label>
              <input type="time" className="input" value={editForm.startTime} onChange={e=>setEditForm({...editForm,startTime:e.target.value})} /></div>
            <div><label className="label">To</label>
              <input type="time" className="input" value={editForm.endTime} onChange={e=>setEditForm({...editForm,endTime:e.target.value})} /></div>
          </div>
          <div><label className="label">Role</label>
            <select className="input" value={editForm.isAdmin} onChange={e=>setEditForm({...editForm,isAdmin:parseInt(e.target.value)})}>
              <option value={0}>User</option>
              <option value={1}>Admin</option>
            </select>
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
