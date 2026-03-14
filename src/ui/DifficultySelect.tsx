/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

export type DifficultyLevel = 'all' | 1 | 2 | 3

const OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 1, label: '1 (easiest)' },
  { value: 2, label: '1–2' },
  { value: 3, label: '1–3 (all)' },
]

interface DifficultySelectProps {
  value: DifficultyLevel
  onChange: (value: DifficultyLevel) => void
  id?: string
}

export function DifficultySelect({ value, onChange, id }: DifficultySelectProps) {
  return (
    <div className="difficulty-select">
      <label htmlFor={id ?? 'difficulty'} className="difficulty-label">
        Difficulty
      </label>
      <select
        id={id ?? 'difficulty'}
        value={value}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === 'all' ? 'all' : (Number(v) as 1 | 2 | 3))
        }}
        className="difficulty-select-input"
        aria-label="Difficulty level filter"
      >
        {OPTIONS.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
