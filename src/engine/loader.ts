import type {
  CaseEndingsRule,
  GenderArticleRule,
  PluralizationRule,
  VerbConjugationRule,
} from './types'
import {
  CONCEPT_TYPE_CASE_ENDINGS,
  CONCEPT_TYPE_GENDER_ARTICLE,
  CONCEPT_TYPE_PLURALIZATION,
  CONCEPT_TYPE_VERB_CONJUGATION,
} from './types'

const base = (typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL.replace(/\/$/, '') : '')
const RULES_BASE = base ? base + '/rules' : '/rules'

/**
 * Load a verb conjugation rule set from public/rules/ by path.
 * @param path - e.g. "verb-conjugation/present-en.json"
 */
export async function loadVerbConjugationRules(
  rulePath: string
): Promise<VerbConjugationRule> {
  const url = `${RULES_BASE}/${rulePath}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load rules: ${res.status} ${url}`)
  }
  const data = (await res.json()) as unknown
  if (!isVerbConjugationRule(data)) {
    throw new Error(`Invalid verb conjugation rule: ${url}`)
  }
  return data
}

function isVerbConjugationRule(
  data: unknown
): data is VerbConjugationRule {
  if (data === null || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  if (o.conceptType !== CONCEPT_TYPE_VERB_CONJUGATION) return false
  if (typeof o.language !== 'string' || typeof o.tense !== 'string') return false
  if (!Array.isArray(o.persons) || !Array.isArray(o.items)) return false
  for (const item of o.items as unknown[]) {
    if (!isVerbItem(item)) return false
  }
  return true
}

function isVerbItem(item: unknown): boolean {
  if (item === null || typeof item !== 'object') return false
  const o = item as Record<string, unknown>
  if (typeof o.infinitive !== 'string') return false
  if (o.forms === null || typeof o.forms !== 'object') return false
  const persons = ['1s', '2s', '3s', '1p', '2p', '3p'] as const
  for (const p of persons) {
    if (typeof (o.forms as Record<string, unknown>)[p] !== 'string') return false
  }
  return true
}

/**
 * Load a gender/article rule set from public/rules/ by path.
 * @param rulePath - e.g. "gender-article/german-definite.json"
 */
export async function loadGenderArticleRules(
  rulePath: string
): Promise<GenderArticleRule> {
  const url = `${RULES_BASE}/${rulePath}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load rules: ${res.status} ${url}`)
  }
  const data = (await res.json()) as unknown
  if (!isGenderArticleRule(data)) {
    throw new Error(`Invalid gender/article rule: ${url}`)
  }
  return data
}

function isGenderArticleRule(data: unknown): data is GenderArticleRule {
  if (data === null || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  if (o.conceptType !== CONCEPT_TYPE_GENDER_ARTICLE) return false
  if (typeof o.language !== 'string' || typeof o.articleType !== 'string') return false
  if (!Array.isArray(o.items)) return false
  for (const item of o.items as unknown[]) {
    if (!isGenderArticleItem(item)) return false
  }
  return true
}

function isGenderArticleItem(item: unknown): boolean {
  if (item === null || typeof item !== 'object') return false
  const o = item as Record<string, unknown>
  return typeof o.noun === 'string' && typeof o.article === 'string'
}

/**
 * Load a pluralization rule set from public/rules/ by path.
 */
export async function loadPluralizationRules(
  rulePath: string
): Promise<PluralizationRule> {
  const url = `${RULES_BASE}/${rulePath}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load rules: ${res.status} ${url}`)
  const data = (await res.json()) as unknown
  if (!isPluralizationRule(data)) throw new Error(`Invalid pluralization rule: ${url}`)
  return data
}

function isPluralizationRule(data: unknown): data is PluralizationRule {
  if (data === null || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  if (o.conceptType !== CONCEPT_TYPE_PLURALIZATION) return false
  if (typeof o.language !== 'string' || !Array.isArray(o.items)) return false
  for (const item of o.items as unknown[]) {
    if (!isPluralizationItem(item)) return false
  }
  return true
}

function isPluralizationItem(item: unknown): boolean {
  if (item === null || typeof item !== 'object') return false
  const o = item as Record<string, unknown>
  return typeof o.singular === 'string' && typeof o.plural === 'string'
}

/**
 * Load a case-endings rule set from public/rules/ by path.
 */
export async function loadCaseEndingsRules(
  rulePath: string
): Promise<CaseEndingsRule> {
  const url = `${RULES_BASE}/${rulePath}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load rules: ${res.status} ${url}`)
  const data = (await res.json()) as unknown
  if (!isCaseEndingsRule(data)) throw new Error(`Invalid case-endings rule: ${url}`)
  return data
}

function isCaseEndingsRule(data: unknown): data is CaseEndingsRule {
  if (data === null || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  if (o.conceptType !== CONCEPT_TYPE_CASE_ENDINGS) return false
  if (typeof o.language !== 'string' || typeof o.contextName !== 'string') return false
  if (!Array.isArray(o.items)) return false
  for (const item of o.items as unknown[]) {
    if (!isCaseEndingsItem(item)) return false
  }
  return true
}

function isCaseEndingsItem(item: unknown): boolean {
  if (item === null || typeof item !== 'object') return false
  const o = item as Record<string, unknown>
  return typeof o.label === 'string' && typeof o.form === 'string'
}

/** Default rule path used when none is specified */
export const DEFAULT_RULE_PATH = 'verb-conjugation/present-en.json'
