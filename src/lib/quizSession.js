// Builds one quiz round: 5 easy + 5 medium + 5 hard questions, mixed up.
// Questions rotate: each level works through its pool before any question repeats,
// and the answer options are shuffled so the order never becomes a pattern.
export const LEVELS = ['easy', 'medium', 'hard']
export const PER_LEVEL = 5

export function shuffle(items) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Picks n from a pool, preferring questions not seen in the current rotation.
function pickLevel(pool, seen, n) {
  const first = shuffle(pool.filter((q) => !seen.has(q.id))).slice(0, n)
  if (first.length === n) {
    return { picked: first, seen: [...first.map((q) => q.id), ...pool.filter((q) => seen.has(q.id)).map((q) => q.id)] }
  }
  // the pool ran out: start a new rotation and top up from the rest
  const taken = new Set(first.map((q) => q.id))
  const extra = shuffle(pool.filter((q) => !taken.has(q.id))).slice(0, n - first.length)
  return { picked: [...first, ...extra], seen: extra.map((q) => q.id) }
}

// Pure: returns the session and the updated rotation memory (stored with the quiz state).
export function buildSession(questions, seenIds = []) {
  const seen = new Set(seenIds)
  let picked = []
  let nextSeen = []
  for (const level of LEVELS) {
    const pool = questions.filter((q) => q.difficulty === level)
    const r = pickLevel(pool, seen, PER_LEVEL)
    picked = picked.concat(r.picked)
    nextSeen = nextSeen.concat(r.seen)
  }
  if (!picked.length) picked = shuffle(questions).slice(0, PER_LEVEL * LEVELS.length)
  return {
    session: shuffle(picked).map((q) => ({ id: q.id, order: shuffle(q.options.map((_, i) => i)) })),
    seen: nextSeen,
  }
}

// A question with its options in the shuffled order; `correct` is remapped.
export function present(q, order) {
  const o = order ?? shuffle(q.options.map((_, i) => i))
  return { ...q, options: o.map((i) => q.options[i]), correct: o.indexOf(q.correct) }
}

export function sessionIsValid(session, questions) {
  return (
    Array.isArray(session) &&
    session.length > 0 &&
    new Set(session.map((s) => s.id)).size === session.length &&
    session.every((s) => {
      const q = questions.find((x) => x.id === s.id)
      return (
        q &&
        Array.isArray(s.order) &&
        s.order.length === q.options.length &&
        new Set(s.order).size === q.options.length &&
        s.order.every((i) => Number.isInteger(i) && i >= 0 && i < q.options.length)
      )
    })
  )
}

export function quizStateIsValid(state, questions) {
  if (!state || !sessionIsValid(state.session, questions)) return false
  if (!Number.isInteger(state.index) || state.index < 0 || state.index >= state.session.length) return false
  if (!Number.isInteger(state.score) || state.score < 0 || state.score > state.session.length) return false
  if (typeof state.done !== 'boolean' || !Array.isArray(state.seen)) return false

  const current = state.session[state.index]
  return (
    state.picked === null ||
    (Number.isInteger(state.picked) && state.picked >= 0 && state.picked < current.order.length)
  )
}
