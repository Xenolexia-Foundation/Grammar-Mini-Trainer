/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { HistoryEntry, SessionStats, StreakData } from './types'

const KEY_STREAK = 'grammar-trainer-streak'
const KEY_SESSION = 'grammar-trainer-session'
const KEY_HISTORY = 'grammar-trainer-history'
const MAX_HISTORY = 7

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

/**
 * Get current streak and last activity date.
 */
export function getStreak(): { streak: number; lastActivityDate: string | null } {
  const data = readJson<StreakData | null>(KEY_STREAK, null)
  if (!data) return { streak: 0, lastActivityDate: null }
  return { streak: data.streak, lastActivityDate: data.lastActivityDate }
}

/**
 * Get session stats for the current run (correct/total).
 */
export function getSessionStats(): SessionStats {
  const data = readJson<SessionStats>(KEY_SESSION, { correct: 0, total: 0 })
  return { correct: data.correct ?? 0, total: data.total ?? 0 }
}

/**
 * Get last N session entries for "Recent" view.
 */
export function getRecentHistory(): HistoryEntry[] {
  const data = readJson<HistoryEntry[]>(KEY_HISTORY, [])
  return Array.isArray(data) ? data.slice(0, MAX_HISTORY) : []
}

/**
 * Record one answer: update session and streak (if first activity today).
 */
export function recordAnswer(correct: boolean): void {
  const session = getSessionStats()
  session.correct += correct ? 1 : 0
  session.total += 1
  writeJson(KEY_SESSION, session)

  const { lastActivityDate, streak } = getStreak()
  const todayStr = today()
  if (lastActivityDate !== todayStr) {
    const yesterdayStr = yesterday()
    const newStreak = lastActivityDate === yesterdayStr ? streak + 1 : 1
    writeJson(KEY_STREAK, { lastActivityDate: todayStr, streak: newStreak })
  }
}

/**
 * Reset session (e.g. when starting a new drill).
 */
export function resetSession(): void {
  writeJson(KEY_SESSION, { correct: 0, total: 0 })
}

/**
 * End current session: append to history (if any answers), then clear session.
 */
export function endSession(conceptLabel: string): void {
  const session = getSessionStats()
  if (session.total > 0) {
    const history = getRecentHistory()
    history.unshift({
      date: today(),
      conceptLabel,
      correct: session.correct,
      total: session.total,
    })
    writeJson(KEY_HISTORY, history.slice(0, MAX_HISTORY))
  }
  resetSession()
}
