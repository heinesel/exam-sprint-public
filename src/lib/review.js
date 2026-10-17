import { load, save } from './storage.js'

// A wrong answer puts the question in the review queue.
// Two correct answers in a row take it out again.
export const CLEAR_STREAK = 2

const STATS_KEY = 'stats'

export const getStats = () => load(STATS_KEY, {})

export function recordAnswer(moduleId, questionId, correct) {
  const stats = getStats()
  const key = `${moduleId}:${questionId}`
  const prev = stats[key] ?? { moduleId, questionId, attempts: 0, correct: 0, streak: 0, inReview: false }
  const next = { ...prev, attempts: prev.attempts + 1 }
  if (correct) {
    next.correct = prev.correct + 1
    next.streak = prev.streak + 1
    if (prev.inReview && next.streak >= CLEAR_STREAK) next.inReview = false
  } else {
    next.streak = 0
    next.inReview = true
  }
  stats[key] = next
  save(STATS_KEY, stats)
  return next
}

const inModules = (ids) => (s) => !ids || ids.includes(s.moduleId)

// moduleIds (optional) limits the queue to one course
export function reviewQueue(moduleIds) {
  return Object.values(getStats())
    .filter(inModules(moduleIds))
    .filter((s) => s.inReview)
}

// Deletes saved answers for the given modules only (other courses are kept).
export function resetModules(moduleIds) {
  const stats = getStats()
  for (const key of Object.keys(stats)) {
    if (moduleIds.includes(stats[key].moduleId)) delete stats[key]
  }
  save(STATS_KEY, stats)
}

export function summarize(modules) {
  const entries = Object.values(getStats()).filter(inModules(modules.map((m) => m.id)))
  const answered = entries.reduce((n, s) => n + s.attempts, 0)
  const correct = entries.reduce((n, s) => n + s.correct, 0)
  const perModule = modules.map((m) => {
    const mine = entries.filter((s) => s.moduleId === m.id)
    const attempts = mine.reduce((n, s) => n + s.attempts, 0)
    const right = mine.reduce((n, s) => n + s.correct, 0)
    return {
      id: m.id,
      title: m.title,
      attempts,
      accuracy: attempts ? Math.round((right / attempts) * 100) : null,
      review: mine.filter((s) => s.inReview).length,
    }
  })
  const withData = perModule.filter((m) => m.attempts > 0)
  const sorted = [...withData].sort((a, b) => b.accuracy - a.accuracy)
  return {
    answered,
    accuracy: answered ? Math.round((correct / answered) * 100) : null,
    perModule,
    strongest: withData.length >= 2 ? sorted[0] : null,
    weakest: withData.length >= 2 ? sorted[sorted.length - 1] : null,
    toReview: entries.filter((s) => s.inReview).length,
  }
}
