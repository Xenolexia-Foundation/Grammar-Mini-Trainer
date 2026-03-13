import type { HistoryEntry } from '@/storage'

interface RecentHistoryProps {
  entries: HistoryEntry[]
}

export function RecentHistory({ entries }: RecentHistoryProps) {
  if (entries.length === 0) return null
  return (
    <section className="recent-history" aria-label="Recent sessions">
      <h3 className="recent-history-title">Recent</h3>
      <ul className="recent-history-list" role="list">
        {entries.map((e, i) => (
          <li key={`${e.date}-${e.conceptLabel}-${i}`}>
            <span className="recent-history-date">{e.date}</span>
            <span className="recent-history-concept">{e.conceptLabel}</span>
            <span className="recent-history-score">
              {e.correct}/{e.total}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
