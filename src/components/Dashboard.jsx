import { useState } from 'react'
import { resetModules, summarize } from '../lib/review.js'
import { remove } from '../lib/storage.js'

const dash = '—'

export default function Dashboard({ subject, onNavigate }) {
  const [version, setVersion] = useState(0) // bumped to re-read after a reset
  const s = summarize(subject.modules, version)
  const [confirming, setConfirming] = useState(false)

  const tiles = [
    { label: 'Questions answered', value: s.answered, color: 'blue' },
    { label: 'Overall accuracy', value: s.accuracy === null ? dash : `${s.accuracy}%`, color: 'green' },
    { label: 'Strongest module', value: s.strongest?.title.replace(/^Module \d+: /, '') ?? dash, color: 'yellow', small: true },
    { label: 'Weakest module', value: s.weakest?.title.replace(/^Module \d+: /, '') ?? dash, color: 'pink', small: true },
    { label: 'To review', value: s.toReview, color: 'orange' },
  ]

  const reset = () => {
    resetModules(subject.modules.map((m) => m.id))
    subject.modules.forEach((m) => remove(`quiz:${m.id}`))
    setConfirming(false)
    setVersion((v) => v + 1)
  }

  return (
    <section>
      <h1>
        Your <span className="hl">progress</span>
      </h1>
      <p className="tagline">{subject.name}</p>

      {s.answered === 0 && (
        <div className="postit c-yellow dashboard-start">
          <h3>Start your progress</h3>
          <p>Complete a short quiz to see your accuracy, strongest topics and what to review.</p>
          <button className="btn" onClick={() => onNavigate('practice')}>
            Choose a module →
          </button>
        </div>
      )}

      <div className="grid">
        {tiles.map((t) => (
          <div key={t.label} className={`postit c-${t.color}`}>
            <h3>{t.label}</h3>
            <div className={t.small ? 'big small' : 'big'}>{t.value}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">By module</h2>
      <div className="bars">
        {s.perModule.map((m) => (
          <div key={m.id} className="bar-row">
            <div className="bar-label">
              <span>{m.title}</span>
              <span className="muted">
                {m.attempts ? `${m.accuracy}% · ${m.attempts} answered` : 'not started'}
              </span>
            </div>
            <div className="bar" aria-hidden="true">
              <span style={{ width: `${m.accuracy ?? 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="note">Complete questions in two modules to see your strongest and weakest.</p>

      <div className="actions">
        {confirming ? (
          <>
            <button className="btn" onClick={reset}>
              Yes, delete my progress
            </button>
            <button className="btn alt" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn alt small" onClick={() => setConfirming(true)}>
            Reset progress
          </button>
        )}
      </div>
    </section>
  )
}
