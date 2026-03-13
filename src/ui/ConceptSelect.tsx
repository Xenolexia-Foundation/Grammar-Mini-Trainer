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
