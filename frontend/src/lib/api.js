export function getApiBase() {
  const url = import.meta.env.VITE_API_URL
  if (!url) return ''
  return url.replace(/\/$/, '')
}

export async function postJson(path, body) {
  const base = getApiBase()
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const msg = data?.detail || data?.message || `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data
}

