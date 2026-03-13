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
