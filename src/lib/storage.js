// Thin localStorage wrapper. Never throws (private mode, quota, corrupt data).
const PREFIX = 'examsprint:'
const STORAGE_VERSION = 1

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed?.version === STORAGE_VERSION && 'data' in parsed ? parsed.data : parsed
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ version: STORAGE_VERSION, data: value }))
  } catch {
    // ignore: progress just will not persist
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // ignore
  }
}
