import { useState } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'

export default function ProfileTab({ username, isAdmin }) {
  const [form, setForm] = useState({ current_password:'', new_password:'', confirm_password:'' })
  const [saving, setSaving] = useState(false)

  const change = async () => {
    if (!form.current_password || !form.new_password || !form.confirm_password) {
      toast('Fill all fields', 'error'); return
    }
    if (form.new_password !== form.confirm_password) {
      toast("Passwords don't match", 'error'); return
    }
    if (form.new_password.length < 4) {
      toast('Password too short (min 4)', 'error'); return
    }
    setSaving(true)
    const d = await api.changePassword({ username, current_password: form.current_password, new_password: form.new_password })
    if (d?.success) {
      toast('Password changed!', 'success')
      setForm({ current_password:'', new_password:'', confirm_password:'' })
    } else toast(d?.message || 'Error', 'error')
    setSaving(false)
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Account Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Username</span>
            <span className="font-medium text-gray-800">{username}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-800">{isAdmin ? '👑 Admin' : '👤 User'}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
        <div className="space-y-3">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" value={form.current_password}
              onChange={e => setForm({...form, current_password:e.target.value})} />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" value={form.new_password}
              onChange={e => setForm({...form, new_password:e.target.value})} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" value={form.confirm_password}
              onChange={e => setForm({...form, confirm_password:e.target.value})} />
          </div>
          <button className="btn-primary w-full justify-center" onClick={change} disabled={saving}>
            {saving ? 'Saving…' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  )
}
