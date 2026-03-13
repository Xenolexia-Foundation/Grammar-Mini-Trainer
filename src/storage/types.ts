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
