/**
 * Thin client for /api/admin.php. Every mutating call carries the custom
 * header + CSRF token the PHP side requires.
 */
let csrf = ''

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const ENDPOINT = '/api/admin.php'

async function parse(res) {
  const type = res.headers.get('content-type') || ''
  if (!type.includes('application/json')) {
    throw new ApiError('API indisponible : le serveur PHP ne répond pas.', res.status || 0)
  }
  const data = await res.json()
  if (!res.ok) throw new ApiError(data?.error || `Erreur ${res.status}`, res.status)
  if (data?.csrf) csrf = data.csrf
  return data
}

async function request(action, { method = 'GET', body } = {}) {
  const headers = { 'X-Requested-With': 'kosmo-admin' }
  if (method !== 'GET') headers['X-CSRF-Token'] = csrf
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  let res
  try {
    res = await fetch(`${ENDPOINT}?action=${action}`, {
      method,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Connexion impossible. Vérifiez votre réseau.', 0)
  }
  return parse(res)
}

/** Upload with progress callback (fetch has no upload progress). */
function upload(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${ENDPOINT}?action=upload`)
    xhr.withCredentials = true
    xhr.setRequestHeader('X-Requested-With', 'kosmo-admin')
    xhr.setRequestHeader('X-CSRF-Token', csrf)
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(e.loaded / e.total) }
    xhr.onerror = () => reject(new ApiError('Échec de l’envoi.', 0))
    xhr.onload = () => {
      let data = null
      try { data = JSON.parse(xhr.responseText) } catch { /* not JSON */ }
      if (xhr.status === 413) return reject(new ApiError('Fichier trop lourd pour le serveur.', 413))
      if (!data) return reject(new ApiError('Réponse invalide du serveur.', xhr.status))
      if (xhr.status >= 400) return reject(new ApiError(data.error || `Erreur ${xhr.status}`, xhr.status))
      resolve(data.url)
    }
    const form = new FormData()
    form.append('file', file)
    xhr.send(form)
  })
}

export const api = {
  me: () => request('me'),
  login: (username, password) => request('login', { method: 'POST', body: { username, password } }),
  logout: () => request('logout', { method: 'POST', body: {} }),
  projects: () => request('projects').then((d) => d.projects || []),
  save: (project) => request('save', { method: 'POST', body: { project } }).then((d) => d.project),
  publish: (id, published) => request('publish', { method: 'POST', body: { id, published } }).then((d) => d.project),
  remove: (id) => request('delete', { method: 'POST', body: { id } }),
  reorder: (ids) => request('reorder', { method: 'POST', body: { ids } }),
  upload,
}
