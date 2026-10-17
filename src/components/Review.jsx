import { useState } from 'react'
import { getQuestion } from '../data/subjects/index.js'
import { CLEAR_STREAK, recordAnswer, reviewQueue } from '../lib/review.js'
import { present } from '../lib/quizSession.js'
import QuestionCard from './QuestionCard.jsx'

// Practice the questions you missed. Two correct answers in a row clear a question.
export default function Review({ subject }) {
  // snapshot the queue when the page opens so it does not shift while answering
  const [items] = useState(() =>
    reviewQueue(subject.modules.map((m) => m.id))
      .map((s) => ({ moduleId: s.moduleId, q: getQuestion(s.moduleId, s.questionId) }))
      .filter((i) => i.q)
      .map((i) => ({ ...i, q: present(i.q) })),
  )
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [result, setResult] = useState(null)
  const [cleared, setCleared] = useState(0)

  if (!items.length) {
    return (
      <section>
        <h1>
          Review your <span className="hl">mistakes</span>
        </h1>
        <p className="tagline">Missed questions return here for another try.</p>
        <div className="postit c-pink empty">
          <h3>Nothing to review</h3>
          <p className="muted">Missed questions will appear here.</p>
        </div>
      </section>
    )
  }

  if (index >= items.length) {
    return (
      <section>
        <h1>
          Review <span className="hl">done</span>
        </h1>
        <div className="postit c-green result">
          <h3>Questions cleared</h3>
          <div className="big">
            {cleared} / {items.length}
          </div>
          <p className="muted">
            {cleared === items.length
              ? 'Your review list is empty.'
              : 'The rest stay in Review until you get them right twice in a row.'}
          </p>
        </div>
      </section>
    )
  }

  const { moduleId, q } = items[index]
  const moduleTitle = subject.modules.find((m) => m.id === moduleId)?.title

  const pick = (i) => {
    const correct = i === q.correct
    const s = recordAnswer(moduleId, q.id, correct)
    if (correct && !s.inReview) setCleared((c) => c + 1)
    setResult({ correct, streak: s.streak, inReview: s.inReview })
    setPicked(i)
  }

  const next = () => {
    setIndex(index + 1)
    setPicked(null)
    setResult(null)
  }

  let note = null
  if (result) {
    if (!result.correct) note = 'Stays in Review. Get it right twice in a row to clear it.'
    else if (!result.inReview) note = 'Cleared from Review.'
    else note = `${CLEAR_STREAK - result.streak} more correct in a row to clear it.`
  }

  return (
    <section className="quiz">
      <h1>
        Review your <span className="hl">mistakes</span>
      </h1>
      <p className="tagline">
        {moduleTitle} · {index + 1} of {items.length}
      </p>
      <QuestionCard
        key={`${moduleId}:${q.id}`}
        question={q}
        picked={picked}
        onPick={pick}
        onNext={next}
        nextLabel={index + 1 === items.length ? 'Finish' : 'Next question →'}
        note={note}
      />
    </section>
  )
}
