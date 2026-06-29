import { useState, useEffect } from 'react'
import { api } from '../../api'
import { toast } from '../../hooks'
import { Spinner } from '../../ui'

function SettingField({ name, meta, value, onChange }) {
  const { label, type, min, max } = meta

  if (type === 'bool') {
    return (
      <label className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-gray-700">{label}</span>
        <div
          onClick={() => onChange(name, !value)}
          className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${value ? 'bg-indigo-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </label>
    )
  }

  if (type === 'password') {
    return (
      <div className="py-1.5">
        <label className="label">{label}</label>
        <input type="password" className="input" value={value || ''}
          onChange={e => onChange(name, e.target.value)}
          placeholder="Leave blank to keep current" />
      </div>
    )
  }

  return (
    <div className="py-1.5">
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type === 'int' || type === 'float' ? 'number' : 'text'}
          className="input"
          value={value ?? ''}
          min={min} max={max}
          step={type === 'float' ? '0.01' : '1'}
          onChange={e => onChange(name, e.target.value)}
        />
        {min != null && max != null && (
          <span className="text-xs text-gray-400 whitespace-nowrap">{min} – {max}</span>
        )}
      </div>
    </div>
  )
}

function SettingsGroup({ title, settings, values, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="px-4 divide-y divide-gray-50">
        {Object.entries(settings).map(([key, meta]) => (
          <SettingField key={key} name={key} meta={meta}
            value={values[key]} onChange={onChange} />
        ))}
      </div>
    </div>
  )
}

export default function SettingsTab() {
  const [settings, setSettings] = useState(null)
  const [values,   setValues]   = useState({})
  const [dirty,    setDirty]    = useState({})
  const [saving,   setSaving]   = useState(false)

  const load = async () => {
    const d = await api.settings()
    if (d?.success) {
      setSettings(d.settings)
      const vals = {}
      Object.entries(d.settings).forEach(([k, v]) => { vals[k] = v.value })
      setValues(vals)
      setDirty({})
    }
  }

  useEffect(() => { load() }, [])

  const onChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }))
    setDirty(prev => ({ ...prev, [key]: true }))
  }

  const save = async () => {
    const updates = {}
    Object.keys(dirty).forEach(k => { updates[k] = values[k] })
    if (Object.keys(updates).length === 0) { toast('Nothing changed', 'info'); return }
    setSaving(true)
    const d = await api.saveSettings(updates)
    if (d?.success) {
      toast('Settings saved — camera/recognition will pick up changes within 30s', 'success')
      setDirty({})
      load()
    } else toast(d?.message || 'Error saving', 'error')
    setSaving(false)
  }

  const reset = () => { load(); toast('Reverted', 'info') }

  if (!settings) return <Spinner />

  // Group settings by their group field
  const groups = {}
  Object.entries(settings).forEach(([key, meta]) => {
    const g = meta.group || 'General'
    if (!groups[g]) groups[g] = {}
    groups[g][key] = meta
  })

  const hasDirty = Object.keys(dirty).length > 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">System Settings</h2>
        <div className="flex gap-2">
          {hasDirty && <button className="btn-secondary" onClick={reset}>Revert</button>}
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : hasDirty ? `Save (${Object.keys(dirty).length} changed)` : 'Save'}
          </button>
        </div>
      </div>

      {hasDirty && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-yellow-800">
          ⚠️ You have unsaved changes. Camera and recognition servers update every 30 seconds after saving.
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(groups).map(([groupName, groupSettings]) => (
          <SettingsGroup key={groupName} title={groupName}
            settings={groupSettings} values={values} onChange={onChange} />
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
        <strong>Note:</strong> YuNet thresholds require the camera server to recreate the detector.
        After saving detection settings, changes apply on the next camera server restart or within 30 seconds via auto-refresh.
      </div>
    </div>
  )
}
