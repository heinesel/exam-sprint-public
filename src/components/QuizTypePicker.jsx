import { getContent } from '../data/subjects/index.js'

export default function QuizTypePicker({ module, onSelect }) {
  const content = getContent(module.id)
  const quizLength = ['easy', 'medium', 'hard'].reduce(
    (total, level) => total + Math.min(5, content?.questions?.filter((q) => q.difficulty === level).length ?? 0),
    0,
  )
  const types = [
    {
      id: 'notes',
      title: 'Study notes',
      text: 'Key ideas, examples and illustrations.',
      action: 'Read notes →',
      color: 'blue',
      ready: Boolean(content?.notes?.length),
    },
    {
      id: 'test',
      title: 'Test quiz',
      text: content ? `${quizLength} mixed questions with instant explanations.` : 'Questions with instant explanations.',
      action: 'Start quiz →',
      color: 'yellow',
      ready: Boolean(content?.questions?.length),
    },
  ]

  return (
    <section>
      <h1>
        Choose how to <span className="hl">study</span>
      </h1>
      <p className="tagline">{module.title}</p>

      <div className="grid">
        {types.map((t) =>
          t.ready ? (
            <button key={t.id} className={`postit c-${t.color}`} onClick={() => onSelect(t)}>
              <h3>{t.title}</h3>
              <p className="muted">{t.text}</p>
              <span className="cta">{t.action}</span>
            </button>
          ) : (
            <div key={t.id} className="postit c-paper">
              <h3>{t.title}</h3>
              <p className="muted">Coming soon for this module.</p>
            </div>
          ),
        )}
      </div>
    </section>
  )
}
