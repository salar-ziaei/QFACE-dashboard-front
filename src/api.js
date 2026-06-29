const req = async (method, url, body, params) => {
  const fullUrl = params ? url + '?' + new URLSearchParams(params) : url
  const res = await fetch(fullUrl, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  if (res.status === 401) { window.location.href = '/login'; return null }
  return res.json()
}

export const api = {
  // Auth
  login:          (u, p, r)   => req('POST', '/api/login', { username:u, password:p, remember:r }),
  logout:         ()           => req('POST', '/api/logout'),
  checkAdmin:     ()           => req('GET',  '/api/check_admin'),
  changePassword: (d)          => req('POST', '/api/change_password', d),

  // Logs
  logs:           (p)          => req('GET',  '/api/proxy/logs', null, p),
  deleteLog:      (id)         => req('DELETE',`/api/proxy/logs/${id}`),
  clearLogs:      ()           => req('DELETE','/api/proxy/clear_logs'),
  moveToDb:       (id, name)   => req('POST', `/api/proxy/logs/${id}/move_to_database`, name ? {name} : {}),

  // Stats
  stats:          ()           => req('GET',  '/api/proxy/stats'),

  // Faces
  faces:          ()           => req('GET',  '/api/proxy/faces'),
  createFace:     (d)          => req('POST', '/api/proxy/faces', d),
  updateFace:     (name, d)    => req('PUT',  `/api/proxy/faces/${name}`, d),
  deleteFace:     (name)       => req('DELETE',`/api/proxy/faces/${name}`),

  // Trained data
  trainedData:    ()           => req('GET',  '/api/proxy/trained_data'),
  deleteTrainedImage: (p, img) => req('DELETE',`/api/proxy/trained_data/${p}/${img}`),

  // Door
  openDoor:       ()           => req('POST', '/api/proxy/door', { door_id:1, action:'open' }),
  doorLogs:       (p)          => req('GET',  '/api/proxy/door_logs', null, p),

  // Cache
  rebuildCache:   ()           => req('POST', '/api/proxy/cache/rebuild'),

  // Users
  users:          ()           => req('GET',  '/api/users'),
  addUser:        (d)          => req('POST', '/api/users', d),
  updateUser:     (d)          => req('PUT',  '/api/users/update', d),
  deleteUser:     (u)          => req('DELETE','/api/users', { username:u }),

  // Settings
  settings:       ()           => req('GET',  '/api/settings'),
  saveSettings:   (updates)    => req('PUT',  '/api/settings', { updates }),

  //Auto open
  getAO:          ()           => req('GET', '/api/settings/auto_open'),
  setAO:          (value)           => req('PUT', '/api/settings/auto_open', {value}),

  // Log files
  logFiles:       ()           => req('GET',  '/api/log_files'),
  logFile:        (f, lines)   => fetch(`/api/log_file/${f}?lines=${lines||200}`, { credentials:'include' }).then(r=>r.text()),
  clearLogFile:   (f)          => req('POST', `/api/log_file/clear/${f}`),
  clearAllLogs:   ()           => req('POST', '/api/clear_log_files'),

  // Images (returns URL strings, not fetches)
  logImageUrl:    (pred, file, isRec) =>
    isRec && pred && pred !== 'Unknown'
      ? `/api/proxy/log_image/recognised/${pred}/${file}`
      : `/api/proxy/log_image/unrecognised/${file}`,
  trainedImageUrl: (person, img) => `/api/proxy/trained_image/${person}/${img}`,
}
