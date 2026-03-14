/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { ConceptOption } from '@/engine'

interface ConceptSelectProps {
  options: ConceptOption[]
  onSelect: (option: ConceptOption) => void
}

export function ConceptSelect({ options, onSelect }: ConceptSelectProps) {
  return (
    <div className="concept-select">
      <p className="concept-select-intro">Choose a drill:</p>
      <ul className="concept-list" role="list">
        {options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              className="btn btn-concept"
              onClick={() => onSelect(opt)}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
