import type {
  CaseEndingsRule,
  Exercise,
  GenderArticleRule,
  GenerateOptions,
  Person,
  PluralizationRule,
  VerbConjugationRule,
} from './types'
import { getWeightedItemIndex } from '@/storage/srs'

const PERSON_LABELS: Record<Person, string> = {
  '1s': 'I',
  '2s': 'you (singular)',
  '3s': 'he/she/it',
  '1p': 'we',
  '2p': 'you (plural)',
  '3p': 'they',
}

function filterByDifficulty<T extends { difficulty?: number }>(
  items: T[],
  maxDifficulty?: number
): T[] {
  if (maxDifficulty == null || maxDifficulty < 1) return items
  const filtered = items.filter((i) => (i.difficulty ?? 1) <= maxDifficulty)
  return filtered.length > 0 ? filtered : items
}

function pickIndex(length: number, itemKeys: string[], conceptId: string | undefined): number {
  if (length === 0) return 0
  if (conceptId && itemKeys.length === length) {
    return getWeightedItemIndex(itemKeys, conceptId)
  }
  return Math.floor(Math.random() * length)
}

/**
 * Generate one random exercise from a verb conjugation rule set.
 */
export function generateExercise(
  rule: VerbConjugationRule,
  options?: GenerateOptions
): Exercise {
  let items = filterByDifficulty(rule.items, options?.maxDifficulty)
  const persons = rule.persons.length > 0 ? rule.persons : (['1s', '2s', '3s', '1p', '2p', '3p'] as Person[])

  const itemKeys = items.map((i) => i.infinitive)
  const idx = pickIndex(items.length, itemKeys, options?.conceptId)
  const item = items[idx]
  const person = persons[Math.floor(Math.random() * persons.length)]
  const expected = item.forms[person]
  const personLabel = PERSON_LABELS[person]

  const prompt = `Conjugate "${item.infinitive}" in ${rule.tense}, ${personLabel}.`

  return {
    prompt,
    expectedAnswers: [expected],
    hint: `${rule.tense}, ${personLabel}`,
    itemKey: item.infinitive,
  }
}

/**
 * Generate one random exercise from a gender/article rule set.
 */
export function generateGenderArticleExercise(
  rule: GenderArticleRule,
  options?: GenerateOptions
): Exercise {
  const items = filterByDifficulty(rule.items, options?.maxDifficulty)
  const itemKeys = items.map((i) => i.noun)
  const idx = pickIndex(items.length, itemKeys, options?.conceptId)
  const item = items[idx]
  const prompt = `What is the definite article for "${item.noun}"?`
  return {
    prompt,
    expectedAnswers: [item.article],
    hint: rule.hintText ?? rule.articleType,
    itemKey: item.noun,
  }
}

/**
 * Generate one random exercise from a pluralization rule set.
 */
export function generatePluralizationExercise(
  rule: PluralizationRule,
  options?: GenerateOptions
): Exercise {
  const items = filterByDifficulty(rule.items, options?.maxDifficulty)
  const itemKeys = items.map((i) => i.singular)
  const idx = pickIndex(items.length, itemKeys, options?.conceptId)
  const item = items[idx]
  const prompt = `What is the plural of "${item.singular}"?`
  return {
    prompt,
    expectedAnswers: [item.plural],
    hint: rule.hintText ?? 'singular → plural',
    itemKey: item.singular,
  }
}

/**
 * Generate one random exercise from a case-endings rule set.
 */
export function generateCaseEndingsExercise(
  rule: CaseEndingsRule,
  options?: GenerateOptions
): Exercise {
  const items = filterByDifficulty(rule.items, options?.maxDifficulty)
  const itemKeys = items.map((i) => i.label)
  const idx = pickIndex(items.length, itemKeys, options?.conceptId)
  const item = items[idx]
  const prompt = `${rule.contextName}: _____ (${item.label}).`
  return {
    prompt,
    expectedAnswers: [item.form],
    hint: rule.hintText ?? rule.contextName,
    itemKey: item.label,
  }
}
