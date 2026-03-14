/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

export interface StreakData {
  lastActivityDate: string // YYYY-MM-DD
  streak: number
}

export interface SessionStats {
  correct: number
  total: number
}

export interface HistoryEntry {
  date: string // YYYY-MM-DD
  conceptLabel: string
  correct: number
  total: number
}
