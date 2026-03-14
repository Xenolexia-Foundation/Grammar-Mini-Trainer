/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

export {
  getStreak,
  getSessionStats,
  getRecentHistory,
  recordAnswer,
  resetSession,
  endSession,
} from './stats'
export {
  recordItemResult,
  getWeightedItemIndex,
  clearItemHistory,
  getItemHistoryForExport,
  setItemHistoryFromImport,
} from './srs'
export { exportData, importData } from './exportImport'
export type { ExportData, ImportResult } from './exportImport'
export type { StreakData, SessionStats, HistoryEntry } from './types'
