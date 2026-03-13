import type { HistoryEntry, SessionStats, StreakData } from './types'
import { getStreak, getSessionStats, getRecentHistory } from './stats'
import { getItemHistoryForExport, setItemHistoryFromImport } from './srs'

const KEY_STREAK = 'grammar-trainer-streak'
const KEY_SESSION = 'grammar-trainer-session'
const KEY_HISTORY = 'grammar-trainer-history'

export interface ExportData {
  version: 1
  exportedAt: string // ISO
  streak: StreakData | null
  session: SessionStats
  history: HistoryEntry[]
  itemHistory: Record<string, { lastSeen: string; correct: boolean }>
}

export function exportData(): string {
  const streakData = getStreak()
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    streak:
      streakData.lastActivityDate != null
        ? { lastActivityDate: streakData.lastActivityDate, streak: streakData.streak }
        : null,
    session: getSessionStats(),
    history: getRecentHistory(),
    itemHistory: getItemHistoryForExport(),
  }
  return JSON.stringify(data, null, 2)
}

export type ImportResult = { ok: true } | { ok: false; error: string }

export function importData(json: string): ImportResult {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }
  if (data == null || typeof data !== 'object') {
    return { ok: false, error: 'Invalid format' }
  }
  const o = data as Record<string, unknown>
  if (o.version !== 1) {
    return { ok: false, error: 'Unsupported export version' }
  }

  try {
    if (o.streak != null && o.streak !== null) {
      const s = o.streak as Record<string, unknown>
      if (typeof s.lastActivityDate === 'string' && typeof s.streak === 'number') {
        localStorage.setItem(KEY_STREAK, JSON.stringify(o.streak))
      }
    }
    if (o.session != null && typeof o.session === 'object') {
      const s = o.session as Record<string, unknown>
      const session = {
        correct: typeof s.correct === 'number' ? s.correct : 0,
        total: typeof s.total === 'number' ? s.total : 0,
      }
      localStorage.setItem(KEY_SESSION, JSON.stringify(session))
    }
    if (Array.isArray(o.history)) {
      const history = o.history.slice(0, 7).filter(
        (e: unknown) =>
          e != null &&
          typeof e === 'object' &&
          typeof (e as Record<string, unknown>).date === 'string' &&
          typeof (e as Record<string, unknown>).conceptLabel === 'string' &&
          typeof (e as Record<string, unknown>).correct === 'number' &&
          typeof (e as Record<string, unknown>).total === 'number'
      )
      localStorage.setItem(KEY_HISTORY, JSON.stringify(history))
    }
    if (o.itemHistory != null && typeof o.itemHistory === 'object' && !Array.isArray(o.itemHistory)) {
      setItemHistoryFromImport(o.itemHistory as Record<string, { lastSeen: string; correct: boolean }>)
    }
  } catch {
    return { ok: false, error: 'Failed to write data' }
  }
  return { ok: true }
}
