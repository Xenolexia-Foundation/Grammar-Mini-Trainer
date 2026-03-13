import type { CheckResult } from './types'

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Check user answer against expected answer(s).
 * Compares normalized (trimmed, lowercased, single-space) strings.
 */
export function checkAnswer(
  userAnswer: string,
  expectedAnswers: string[]
): CheckResult {
  const normalized = normalize(userAnswer)
  if (!normalized) {
    return { correct: false, expected: expectedAnswers[0] }
  }
  const normalizedExpected = expectedAnswers.map(normalize)
  const correct = normalizedExpected.some((exp) => exp === normalized)
  return {
    correct,
    expected: correct ? undefined : expectedAnswers[0],
  }
}
