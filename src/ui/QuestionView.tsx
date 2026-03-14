/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { useRef, useEffect } from 'react'
import type { CheckResult, Exercise } from '@/engine'

interface QuestionViewProps {
  exercise: Exercise
  feedback: CheckResult | null
  onCheck: (answer: string) => void
  onNext: () => void
  inputValue: string
  onInputChange: (value: string) => void
  checked: boolean
}

export function QuestionView({
  exercise,
  feedback,
  onCheck,
  onNext,
  inputValue,
  onInputChange,
  checked,
}: QuestionViewProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [exercise])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (checked) {
      onNext()
    } else {
      onCheck(inputValue)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="prompt" role="heading" aria-level={2}>
        {exercise.prompt}
      </p>
      {exercise.hint && (
        <p className="rule-hint" aria-label="Hint">
          {exercise.hint}
        </p>
      )}
      <div className="input-row">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          aria-label="Your answer"
          autoComplete="off"
          disabled={checked}
        />
        <button type="submit" className="btn">
          {checked ? 'Next' : 'Check'}
        </button>
      </div>
      {feedback && (
        <div
          className={`feedback ${feedback.correct ? 'correct' : 'incorrect'} feedback-visible`}
          role="status"
          aria-live="polite"
          aria-label={feedback.correct ? 'Result: correct' : 'Result: incorrect'}
        >
          {feedback.correct ? 'Correct!' : 'Incorrect.'}
          {feedback.expected !== undefined && (
            <div className="expected">Expected: {feedback.expected}</div>
          )}
        </div>
      )}
    </form>
  )
}
