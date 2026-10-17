import { useEffect, useState } from 'react'
import { illustrations } from './StudyIllustrations.jsx'

// One question. Before answering: question + options.
// After answering: the solution takes its place, so nothing needs scrolling.
// `compact` (used in the landing-page demo) drops the picture; `noScroll` keeps the page still.
export default function QuestionCard({ question: q, picked, onPick, onNext, nextLabel, note, compact = false, noScroll = false }) {
  const [showNorwegian, setShowNorwegian] = useState(false)
  const answered = picked !== null && picked !== undefined
  const correct = answered && picked === q.correct
  const Illustration = illustrations[q.illustration]

  // a new question or a new state always starts at the top of the page
  useEffect(() => {
    if (!noScroll) window.scrollTo(0, 0)
  }, [q.id, answered, noScroll])

  if (!answered) {
    return (
      <div>
        <div className="card question-card">
          <h2 className="question">{q.text}</h2>
        </div>
        <div className="options">
          {q.options.map((opt, i) => (
            <button key={i} className="option" onClick={() => onPick(i)}>
              <span className="letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`postit ${correct ? 'c-green' : 'c-pink'} feedback`}>
      <h3>{correct ? 'Correct!' : 'Not quite'}</h3>

      <p className="answer-line">
        <strong>Answer: {String.fromCharCode(65 + q.correct)}.</strong> {q.options[q.correct]}
      </p>
      {!correct && (
        <p className="answer-line muted">
          You chose {String.fromCharCode(65 + picked)}. {q.options[picked]}
        </p>
      )}

      <p>{q.explanation}</p>
      {showNorwegian ? (
        <p className="norwegian">🇳🇴 {q.explanationNo}</p>
      ) : (
        <button className="btn alt small" onClick={() => setShowNorwegian(true)}>
          Forklar enklere på norsk
        </button>
      )}
      {note && <p className="muted">{note}</p>}

      {Illustration && !compact && <Illustration />}

      <div className="actions tight">
        <button className="btn" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
