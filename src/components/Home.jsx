import { memo, useEffect, useMemo, useRef, useState } from 'react'
import AiIllustration from './AiIllustration.jsx'
import CyberIllustration from './CyberIllustration.jsx'
import QuestionCard from './QuestionCard.jsx'
import { getContent } from '../data/subjects/index.js'
import { present } from '../lib/quizSession.js'
import { reviewQueue, summarize } from '../lib/review.js'

// one hero illustration per course
const HERO = {
  datasikkerhet: CyberIllustration,
  ai: AiIllustration,
}

const STEPS = [
  { title: 'Practice', text: 'Answer one question at a time and get instant feedback.' },
  { title: 'Review', text: 'Retry missed questions until you know them.' },
  { title: 'Track', text: 'See your strongest topics and what to study next.' },
]

// an easy question from the first module that has questions, shuffled once
function sampleQuestion(subject) {
  for (const m of subject.modules) {
    const c = getContent(m.id)
    const q = c?.questions.find((x) => x.difficulty === 'easy') ?? c?.questions[0]
    if (q) return present(q)
  }
  return null
}

const PracticeScene = memo(function PracticeScene({ question }) {
  const [picked, setPicked] = useState(null)
  if (!question) return <div className="postit c-yellow"><h3>Questions are coming soon</h3></div>
  return (
    <div className="demo">
      <p className="demo-label">Try it: pick an answer</p>
      <QuestionCard
        question={question}
        picked={picked}
        onPick={setPicked}
        onNext={() => setPicked(null)}
        nextLabel="Try again ↺"
        compact
        noScroll
      />
    </div>
  )
})

const ReviewScene = memo(function ReviewScene({ subject, onNavigate }) {
  const waiting = useMemo(() => reviewQueue(subject.modules.map((m) => m.id)).length, [subject])
  return (
    <div className="postit c-pink scene-card">
      <h3>Missed it? It comes back.</h3>
      <ol className="rule">
        <li>
          <span className="chip bad">✗</span> Wrong answer: saved to Review
        </li>
        <li>
          <span className="chip">✓</span> Right once: one more to go
        </li>
        <li>
          <span className="chip good">✓✓</span> Right twice in a row: cleared
        </li>
      </ol>
      <p className="muted">
        {waiting
          ? `${waiting} question${waiting === 1 ? ' is' : 's are'} waiting for you in Review.`
          : 'Your review list is empty for now.'}
      </p>
      <button className="btn alt small" onClick={() => onNavigate('review')}>
        Open Review
      </button>
    </div>
  )
})

const ProgressScene = memo(function ProgressScene({ subject, onNavigate }) {
  const s = useMemo(() => summarize(subject.modules), [subject])
  const dash = '—'
  return (
    <div className="scene-card">
      <p className="demo-label">Your progress</p>
      <div className="mini-tiles">
        <div className="postit c-blue">
          <h3>Answered</h3>
          <div className="big">{s.answered}</div>
        </div>
        <div className="postit c-green">
          <h3>Accuracy</h3>
          <div className="big">{s.accuracy === null ? dash : `${s.accuracy}%`}</div>
        </div>
        <div className="postit c-orange">
          <h3>To review</h3>
          <div className="big">{s.toReview}</div>
        </div>
      </div>
      <div className="bars">
        {s.perModule.slice(0, 3).map((m) => (
          <div key={m.id} className="bar-row">
            <div className="bar-label">
              <span>{m.title}</span>
              <span className="muted">{m.attempts ? `${m.accuracy}%` : 'not started'}</span>
            </div>
            <div className="bar" aria-hidden="true">
              <span style={{ width: `${m.accuracy ?? 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <button className="btn alt small" onClick={() => onNavigate('dashboard')}>
        Open Dashboard
      </button>
    </div>
  )
})

export default function Home({ subject, onNavigate }) {
  const Hero = HERO[subject.id]
  const question = useMemo(() => sampleQuestion(subject), [subject])
  const [active, setActive] = useState(0) // 0 = intro, 1..3 = the three steps
  const track = useRef(null)

  // the scene follows the scroll position; scrolling back brings the previous scene back
  useEffect(() => {
    const marks = track.current?.children
    if (!marks || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.scene))
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const m of marks) io.observe(m)
    return () => io.disconnect()
  }, [])

  const jump = (scene) => {
    const mark = track.current?.children[scene]
    if (!mark) return
    const top = mark.getBoundingClientRect().top + window.scrollY + mark.offsetHeight / 2 - window.innerHeight / 2
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: calm ? 'auto' : 'smooth' })
  }

  return (
    <section className="story">
      <div className="story-pin">
        <div className="story-text">
          <h1>
            Study <span className="hl">smarter</span>,<br />
            remember <span className="scribble">longer</span>
          </h1>
          <p className="tagline">
            Practice <em>{subject.name}</em> with short quizzes. Missed questions return until you know them.
          </p>

          <div className="actions">
            <button className="btn" onClick={() => onNavigate('practice')}>
              Start Practicing
            </button>
            <button className="btn alt" onClick={() => onNavigate('review')}>
              Review Mistakes
            </button>
          </div>

          <ol className="story-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className={active === i + 1 ? 'on' : ''}>
                <button onClick={() => jump(i + 1)}>
                  <span className="num">{i + 1}</span>
                  <span>
                    <strong>{s.title}</strong>
                    <span className="muted"> {s.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="story-stage">
          <div className={`scene ${active === 0 ? 'on' : ''}`}>
            {Hero ? (
              <Hero />
            ) : (
              <div className="postit c-yellow scene-card">
                <h3>How it works</h3>
                <p className="muted">Scroll down: practice, review, track.</p>
              </div>
            )}
          </div>
          <div className={`scene ${active === 1 ? 'on' : ''}`}>
            <PracticeScene question={question} />
          </div>
          <div className={`scene ${active === 2 ? 'on' : ''}`}>
            <ReviewScene subject={subject} onNavigate={onNavigate} />
          </div>
          <div className={`scene ${active === 3 ? 'on' : ''}`}>
            <ProgressScene subject={subject} onNavigate={onNavigate} />
          </div>
        </div>
      </div>

      {/* scroll distance: four marks, the one crossing the middle of the screen picks the scene */}
      <div className="story-track" ref={track} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} data-scene={i} />
        ))}
      </div>
    </section>
  )
}
