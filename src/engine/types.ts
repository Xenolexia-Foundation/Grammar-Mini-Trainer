/**
 * Rule schemas: verb-conjugation (Phase 1), gender-article (Phase 2).
 */

export const CONCEPT_TYPE_VERB_CONJUGATION = 'verb-conjugation' as const
export const CONCEPT_TYPE_GENDER_ARTICLE = 'gender-article' as const
export const CONCEPT_TYPE_PLURALIZATION = 'pluralization' as const
export const CONCEPT_TYPE_CASE_ENDINGS = 'case-endings' as const

export type ConceptType =
  | typeof CONCEPT_TYPE_VERB_CONJUGATION
  | typeof CONCEPT_TYPE_GENDER_ARTICLE
  | typeof CONCEPT_TYPE_PLURALIZATION
  | typeof CONCEPT_TYPE_CASE_ENDINGS

export type Person =
  | '1s'  // first singular (I)
  | '2s'  // second singular (you)
  | '3s'  // third singular (he/she/it)
  | '1p'  // first plural (we)
  | '2p'  // second plural (you)
  | '3p'  // third plural (they)

export interface VerbConjugationItem {
  /** Infinitive form, e.g. "to be", "avoir" */
  infinitive: string
  /** Conjugated forms by person: 1s, 2s, 3s, 1p, 2p, 3p */
  forms: Record<Person, string>
  /** Optional difficulty 1–3 (1 = easiest) */
  difficulty?: number
}

export interface VerbConjugationRule {
  conceptType: typeof CONCEPT_TYPE_VERB_CONJUGATION
  language: string
  /** Tense id used in prompts, e.g. "present", "past" */
  tense: string
  /** Persons to drill (default all) */
  persons: Person[]
  /** Verbs with their conjugated forms */
  items: VerbConjugationItem[]
}

/** Gender/article item: noun + correct definite article */
export interface GenderArticleItem {
  noun: string
  article: string
  /** Optional difficulty 1–3 */
  difficulty?: number
}

export interface GenderArticleRule {
  conceptType: typeof CONCEPT_TYPE_GENDER_ARTICLE
  language: string
  /** e.g. "definite", "indefinite" */
  articleType: string
  /** Prompt hint, e.g. "definite article (der/die/das)" */
  hintText?: string
  items: GenderArticleItem[]
}

/** Pluralization item: singular form → plural form */
export interface PluralizationItem {
  singular: string
  plural: string
  /** Optional difficulty 1–3 */
  difficulty?: number
}

export interface PluralizationRule {
  conceptType: typeof CONCEPT_TYPE_PLURALIZATION
  language: string
  hintText?: string
  items: PluralizationItem[]
}

/** Case endings item: context label (e.g. "nominative, masculine") + correct form */
export interface CaseEndingsItem {
  /** e.g. "nominative, masculine", "accusative, feminine" */
  label: string
  form: string
  /** Optional difficulty 1–3 */
  difficulty?: number
}

export interface CaseEndingsRule {
  conceptType: typeof CONCEPT_TYPE_CASE_ENDINGS
  language: string
  /** e.g. "definite article" */
  contextName: string
  hintText?: string
  items: CaseEndingsItem[]
}

export type GrammarRule =
  | VerbConjugationRule
  | GenderArticleRule
  | PluralizationRule
  | CaseEndingsRule

/** A single exercise question from the engine */
export interface Exercise {
  /** Prompt shown to the user */
  prompt: string
  /** Expected answer(s); checker accepts any of these */
  expectedAnswers: string[]
  /** Optional hint or rule name */
  hint?: string
  /** Underlying item key for analytics (e.g. infinitive) */
  itemKey?: string
}

/** Result of checking the user's answer */
export interface CheckResult {
  correct: boolean
  expected?: string
}

/** Options when generating an exercise (difficulty filter, SRS) */
export interface GenerateOptions {
  /** Max difficulty level to include (1–3); omit for all */
  maxDifficulty?: number
  /** Concept id for SRS weighting (prefer wrong / not seen recently) */
  conceptId?: string
}
