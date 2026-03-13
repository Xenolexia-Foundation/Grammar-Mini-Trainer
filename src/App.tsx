import { useState, useCallback } from 'react'
import {
  CONCEPT_OPTIONS,
  loadRule,
  generateExerciseFromRule,
  checkAnswer,
} from '@/engine'
import type { ConceptOption, Exercise, CheckResult, GrammarRule } from '@/engine'
import type { SessionStats } from '@/storage'
import {
  getStreak,
  getSessionStats,
  getRecentHistory,
  recordAnswer,
  recordItemResult,
  resetSession,
  endSession,
} from '@/storage'
import { ConceptSelect } from '@/ui/ConceptSelect'
import { QuestionView } from '@/ui/QuestionView'
import { StatsBar } from '@/ui/StatsBar'
import { RecentHistory } from '@/ui/RecentHistory'
import { ThemeToggle } from '@/ui/ThemeToggle'
import { DifficultySelect, type DifficultyLevel } from '@/ui/DifficultySelect'
import { ExportImport } from '@/ui/ExportImport'

export default function App() {
  const [selectedOption, setSelectedOption] = useState<ConceptOption | null>(null)
  const [rule, setRule] = useState<GrammarRule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState<CheckResult | null>(null)
  const [checked, setChecked] = useState(false)
  const [sessionStats, setSessionStats] = useState<SessionStats>(() => getSessionStats())
  const [streak, setStreak] = useState(() => getStreak().streak)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('all')

  const startDrill = useCallback(async (option: ConceptOption) => {
    setSelectedOption(option)
    setLoading(true)
    setError(null)
    try {
      const r = await loadRule(option)
      setRule(r)
      setExercise(
        generateExerciseFromRule(r, {
          maxDifficulty: difficulty === 'all' ? undefined : difficulty,
          conceptId: option.id,
        })
      )
      setInputValue('')
      setFeedback(null)
      setChecked(false)
      resetSession()
      setSessionStats(getSessionStats())
      setStreak(getStreak().streak)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load rules')
    } finally {
      setLoading(false)
    }
  }, [difficulty])

  const loadRules = useCallback(() => {
    if (selectedOption) startDrill(selectedOption)
  }, [selectedOption, startDrill])

  // No auto-load: user picks a concept first

  const handleCheck = useCallback(
    (answer: string) => {
      if (!exercise || !selectedOption) return
      const result = checkAnswer(answer, exercise.expectedAnswers)
      setFeedback(result)
      setChecked(true)
      recordAnswer(result.correct)
      if (exercise.itemKey) recordItemResult(selectedOption.id, exercise.itemKey, result.correct)
      setSessionStats(getSessionStats())
      setStreak(getStreak().streak)
    },
    [exercise, selectedOption]
  )

  const handleNext = useCallback(() => {
    if (!rule || !selectedOption) return
    setExercise(
      generateExerciseFromRule(rule, {
        maxDifficulty: difficulty === 'all' ? undefined : difficulty,
        conceptId: selectedOption.id,
      })
    )
    setInputValue('')
    setFeedback(null)
    setChecked(false)
  }, [rule, selectedOption, difficulty])

  const changeConcept = useCallback(() => {
    if (selectedOption) endSession(selectedOption.label)
    setSelectedOption(null)
    setRule(null)
    setExercise(null)
    setFeedback(null)
    setChecked(false)
    setInputValue('')
    setError(null)
  }, [selectedOption])

  // Concept selector: no concept chosen yet
  if (!selectedOption) {
    const { streak } = getStreak()
    return (
      <div className="app">
        <div className="app-header">
          <div className="app-header-left">
            <h1>Grammar Mini-Trainer</h1>
            {streak > 0 && (
              <span className="stats-streak" title="Current streak (days)">
                🔥 {streak} {streak === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>
          <ThemeToggle />
        </div>
        <ConceptSelect options={CONCEPT_OPTIONS} onSelect={startDrill} />
        <ExportImport />
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Loading rules…</div>
  }

  if (error) {
    return (
      <div className="app">
        <div className="error" role="alert">
          {error}
        </div>
        <button type="button" className="btn" onClick={loadRules} style={{ marginTop: '1rem' }}>
          Retry
        </button>
        <button type="button" className="btn btn-secondary" onClick={changeConcept} style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
          Change concept
        </button>
      </div>
    )
  }

  if (!rule || !exercise) {
    return <div className="loading">No exercise available.</div>
  }

  const history = getRecentHistory()

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-header-left">
          <h1>Grammar Mini-Trainer</h1>
          <StatsBar streak={streak} session={sessionStats} />
        </div>
        <div className="app-header-actions">
          <DifficultySelect value={difficulty} onChange={setDifficulty} />
          <ThemeToggle />
          <button type="button" className="btn btn-secondary btn-small" onClick={changeConcept}>
            Change concept
          </button>
        </div>
      </div>
      <QuestionView
        exercise={exercise}
        feedback={feedback}
        onCheck={handleCheck}
        onNext={handleNext}
        inputValue={inputValue}
        onInputChange={setInputValue}
        checked={checked}
      />
      <RecentHistory entries={history} />
    </div>
  )
}
