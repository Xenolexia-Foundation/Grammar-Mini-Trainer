/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { ConceptType, Exercise, GenerateOptions, GrammarRule } from './types'
import {
  CONCEPT_TYPE_CASE_ENDINGS,
  CONCEPT_TYPE_GENDER_ARTICLE,
  CONCEPT_TYPE_PLURALIZATION,
  CONCEPT_TYPE_VERB_CONJUGATION,
} from './types'
import {
  loadCaseEndingsRules,
  loadGenderArticleRules,
  loadPluralizationRules,
  loadVerbConjugationRules,
} from './loader'
import {
  generateCaseEndingsExercise,
  generateExercise,
  generateGenderArticleExercise,
  generatePluralizationExercise,
} from './generator'
import type {
  CaseEndingsRule,
  GenderArticleRule,
  PluralizationRule,
  VerbConjugationRule,
} from './types'

export interface ConceptOption {
  id: string
  label: string
  rulePath: string
  conceptType: ConceptType
}

export const CONCEPT_OPTIONS: ConceptOption[] = [
  { id: 'verb-en', label: 'Verb conjugation (English)', rulePath: 'verb-conjugation/present-en.json', conceptType: CONCEPT_TYPE_VERB_CONJUGATION },
  { id: 'verb-es', label: 'Verb conjugation (Spanish)', rulePath: 'verb-conjugation/present-es.json', conceptType: CONCEPT_TYPE_VERB_CONJUGATION },
  { id: 'gender-de', label: 'Gender / Article (German)', rulePath: 'gender-article/german-definite.json', conceptType: CONCEPT_TYPE_GENDER_ARTICLE },
  { id: 'plural-de', label: 'Pluralization (German)', rulePath: 'pluralization/german-nouns.json', conceptType: CONCEPT_TYPE_PLURALIZATION },
  { id: 'case-de', label: 'Case endings (German definite)', rulePath: 'case-endings/german-definite.json', conceptType: CONCEPT_TYPE_CASE_ENDINGS },
]

type Loader = (rulePath: string) => Promise<GrammarRule>
type Generator = (rule: GrammarRule, options?: GenerateOptions) => Exercise

const loaders: Record<ConceptType, Loader> = {
  [CONCEPT_TYPE_VERB_CONJUGATION]: loadVerbConjugationRules as Loader,
  [CONCEPT_TYPE_GENDER_ARTICLE]: loadGenderArticleRules as Loader,
  [CONCEPT_TYPE_PLURALIZATION]: loadPluralizationRules as Loader,
  [CONCEPT_TYPE_CASE_ENDINGS]: loadCaseEndingsRules as Loader,
}

const generators: Record<ConceptType, Generator> = {
  [CONCEPT_TYPE_VERB_CONJUGATION]: (r, o) => generateExercise(r as VerbConjugationRule, o),
  [CONCEPT_TYPE_GENDER_ARTICLE]: (r, o) => generateGenderArticleExercise(r as GenderArticleRule, o),
  [CONCEPT_TYPE_PLURALIZATION]: (r, o) => generatePluralizationExercise(r as PluralizationRule, o),
  [CONCEPT_TYPE_CASE_ENDINGS]: (r, o) => generateCaseEndingsExercise(r as CaseEndingsRule, o),
}

/** Load rules for a concept option. */
export async function loadRule(option: ConceptOption): Promise<GrammarRule> {
  return loaders[option.conceptType](option.rulePath)
}

/** Generate one exercise from a loaded rule. */
export function generateExerciseFromRule(rule: GrammarRule, options?: GenerateOptions): Exercise {
  return generators[rule.conceptType](rule, options)
}
