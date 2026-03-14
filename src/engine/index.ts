/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

export { checkAnswer } from './checker'
export {
  generateExercise,
  generateGenderArticleExercise,
  generatePluralizationExercise,
  generateCaseEndingsExercise,
} from './generator'
export {
  loadVerbConjugationRules,
  loadGenderArticleRules,
  loadPluralizationRules,
  loadCaseEndingsRules,
  DEFAULT_RULE_PATH,
} from './loader'
export {
  CONCEPT_OPTIONS,
  loadRule,
  generateExerciseFromRule,
} from './registry'
export type { ConceptOption } from './registry'
export type {
  CheckResult,
  Exercise,
  GenerateOptions,
  GrammarRule,
  Person,
  VerbConjugationItem,
  VerbConjugationRule,
  GenderArticleItem,
  GenderArticleRule,
  PluralizationItem,
  PluralizationRule,
  CaseEndingsItem,
  CaseEndingsRule,
  ConceptType,
} from './types'
export {
  CONCEPT_TYPE_VERB_CONJUGATION,
  CONCEPT_TYPE_GENDER_ARTICLE,
  CONCEPT_TYPE_PLURALIZATION,
  CONCEPT_TYPE_CASE_ENDINGS,
} from './types'
