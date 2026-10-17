import { getContent } from '../data/subjects/index.js'
import { summarize } from '../lib/review.js'
import { load } from '../lib/storage.js'

const COLORS = ['blue', 'pink', 'green', 'purple', 'orange', 'yellow']

export default function ModulePicker({ subject, onSelect }) {
  const stats = summarize(subject.modules)
  const modules = subject.modules.map((module, index) => {
    const stat = stats.perModule.find((item) => item.id === module.id)
    const saved = load(`quiz:${module.id}`, null)
    const total = Array.isArray(saved?.session) ? saved.session.length : 0
    const answered = total
      ? Math.min((Number.isInteger(saved?.index) ? saved.index : 0) + (saved?.picked != null ? 1 : 0), total)
      : 0
    const inProgress = total > 0 && !saved?.done && answered > 0
    const ready = !module.comingSoon && Boolean(getContent(module.id))

    let status = 'Not started'
    let action = 'Start →'
    if (!ready) {
      status = 'Content coming soon'
      action = null
    } else if (inProgress) {
      status = `${answered} of ${total} questions completed`
      action = 'Continue →'
    } else if (stat?.attempts) {
      status = `${stat.accuracy}% accuracy · ${stat.attempts} answered`
      action = 'Practice again →'
    }

    return { module, index, stat, ready, inProgress, answered, total, status, action }
  })

  const recommended =
    modules.find((item) => item.ready && item.inProgress) ??
    modules.find((item) => item.ready && !item.stat?.attempts) ??
    [...modules]
      .filter((item) => item.ready && item.stat?.attempts)
      .sort((a, b) => a.stat.accuracy - b.stat.accuracy)[0]

  return (
    <section>
      <h1>
        Pick a <span className="hl">module</span>
      </h1>
      <p className="tagline">Choose a module to begin.</p>

      <div className="grid">
        {modules.map((item) => {
          const { module: m, index: i } = item
          // "Module 3: Cryptography" -> small label + name
          const [kicker, name] = m.title.includes(': ') ? m.title.split(': ') : [null, m.title]

          const contents = (
            <>
              {item.module.id === recommended?.module.id && (
                <span className="recommendation">Recommended next</span>
              )}
              {kicker && <span className="kicker">{kicker}</span>}
              <h3>{name}</h3>
              <span className="module-status">{item.status}</span>
              {item.inProgress && (
                <span
                  className="module-progress"
                  role="progressbar"
                  aria-label={`${name} quiz progress`}
                  aria-valuemin={0}
                  aria-valuemax={item.total}
                  aria-valuenow={item.answered}
                >
                  <span style={{ width: `${(item.answered / item.total) * 100}%` }} />
                </span>
              )}
              {item.action && <span className="cta">{item.action}</span>}
            </>
          )

          if (!item.ready) {
            return (
              <div key={m.id} className={`postit module-card unavailable c-${COLORS[i % COLORS.length]}`}>
                {contents}
              </div>
            )
          }

          return (
            <button
              key={m.id}
              className={`postit module-card c-${COLORS[i % COLORS.length]}`}
              onClick={() => onSelect(m)}
            >
              {contents}
            </button>
          )
        })}
      </div>
    </section>
  )
}
