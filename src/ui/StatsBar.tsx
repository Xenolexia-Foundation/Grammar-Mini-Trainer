/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { SessionStats } from '@/storage'

interface StatsBarProps {
  streak: number
  session: SessionStats
}

export function StatsBar({ streak, session }: StatsBarProps) {
  return (
    <div className="stats-bar" aria-label="Stats">
      {streak > 0 && (
        <span className="stats-streak" title="Current streak (days)">
          🔥 {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      )}
      {session.total > 0 && (
        <span className="stats-session" title="This session">
          {session.correct}/{session.total} correct
        </span>
      )}
    </div>
  )
}
