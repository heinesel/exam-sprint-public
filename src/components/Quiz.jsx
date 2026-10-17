import { useEffect, useState } from 'react'
import { getContent } from '../data/subjects/index.js'
import { load, save } from '../lib/storage.js'
import { recordAnswer } from '../lib/review.js'
import { buildSession, present, quizStateIsValid } from '../lib/quizSession.js'
import QuestionCard from './QuestionCard.jsx'

const newRound = (questions, seen = []) => ({
  ...buildSession(questions, seen),
  index: 0,
  picked: null,
  score: 0,
  done: false,
})

export default function Quiz({ module }) {
  const questions = getContent(module.id)?.questions ?? []
  const key = `quiz:${module.id}`

  // progress is saved per module, so leaving and coming back resumes the quiz
  const [state, setState] = useState(() => {
    const saved = load(key, null)
    return quizStateIsValid(saved, questions) ? saved : newRound(questions)
  })
  useEffect(() => save(key, state), [key, state])

  if (!questions.length) {
    return (
      <section>
        <h1>
          Test <span className="hl">quiz</span>
        </h1>
        <p className="tagline">No questions for this module yet.</p>
      </section>
    )
  }

  const { session, index, picked, score, done } = state
  const total = session.length
  const current = session[Math.min(index, total - 1)]
  const q = present(questions.find((x) => x.id === current.id), current.order)
  const answered = picked !== null
  const last = index + 1 === total

  const pick = (i) => {
    if (answered) return
    const correct = i === q.correct
    recordAnswer(module.id, q.id, correct)
    setState({ ...state, picked: i, score: score + (correct ? 1 : 0) })
  }

  const next = () => {
    if (last) setState({ ...state, done: true })
    else setState({ ...state, index: index + 1, picked: null })
  }

  if (done) {
    return (
      <section>
        <h1>
          Quiz <span className="hl">complete</span>
        </h1>
        <div className="postit c-green result">
          <h3>Your score</h3>
          <div className="big">
            {score} / {total}
          </div>
          <p className="muted">
            {score === total
              ? 'Perfect score. Nothing to review.'
              : 'Missed questions are waiting in Review.'}
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => setState(newRound(questions, state.seen))}>
            Try again
          </button>
        </div>
      </section>
    )
  }

  const progress = index + (answered ? 1 : 0)

  return (
    <section className="quiz">
      <div className="quiz-head">
        <span className="crumb">{module.title}</span>
        <div className="meta">
          <span className="count">
            Question {index + 1} <span className="muted">of {total}</span>
          </span>
          <span className={`pill ${q.difficulty}`}>{q.difficulty}</span>
        </div>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={progress}
      >
        <span style={{ width: `${(progress / total) * 100}%` }} />
      </div>

      <QuestionCard
        key={q.id}
        question={q}
        picked={picked}
        onPick={pick}
        onNext={next}
        nextLabel={last ? 'See result' : 'Next question →'}
      />
    </section>
  )
}
