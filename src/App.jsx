import { useEffect, useRef, useState } from 'react'
import Home from './components/Home.jsx'
import ModulePicker from './components/ModulePicker.jsx'
import QuizTypePicker from './components/QuizTypePicker.jsx'
import Quiz from './components/Quiz.jsx'
import Notes from './components/Notes.jsx'
import Review from './components/Review.jsx'
import Dashboard from './components/Dashboard.jsx'
import { defaultSubject, subjects } from './data/subjects/index.js'
import { load, save } from './lib/storage.js'
import { startGridSnap } from './lib/gridSnap.js'

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'practice', label: 'Practice' },
  { id: 'review', label: 'Review' },
  { id: 'dashboard', label: 'Dashboard' },
]

const MODULE_VIEWS = ['quiztype', 'quiz', 'notes']

function historyState(view, subjectId, moduleId = null) {
  return { view, subjectId, moduleId }
}

export default function App() {
  const [view, setView] = useState('home')
  const [module, setModule] = useState(null)
  const [subjectId, setSubjectId] = useState(() => load('course', defaultSubject.id))
  const subject = subjects.find((s) => s.id === subjectId) ?? defaultSubject
  const mainRef = useRef(null)

  // keep text on the ruled lines of the paper
  useEffect(() => startGridSnap(mainRef.current), [])

  // Save enough context to restore module screens safely with Back / swipe-back.
  useEffect(() => {
    history.replaceState(historyState('home', subject.id), '')

    const onPop = (e) => {
      const saved = e.state
      const nextSubject = subjects.find((s) => s.id === saved?.subjectId) ?? defaultSubject
      const nextModule = nextSubject.modules.find((m) => m.id === saved?.moduleId) ?? null
      const requestedView = saved?.view ?? 'home'

      setSubjectId(nextSubject.id)
      save('course', nextSubject.id)
      setModule(nextModule)
      setView(MODULE_VIEWS.includes(requestedView) && !nextModule ? 'practice' : requestedView)
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (next, nextSubject = subject, nextModule = module) => {
    if (next === view) return
    history.pushState(historyState(next, nextSubject.id, nextModule?.id), '')
    setView(next)
  }

  // switching course clears the chosen module; module screens go back to the module list
  const chooseCourse = (id) => {
    if (id === subject.id) return
    const nextSubject = subjects.find((s) => s.id === id) ?? defaultSubject
    save('course', id)
    setSubjectId(id)
    setModule(null)
    if (MODULE_VIEWS.includes(view)) navigate('practice', nextSubject, null)
    else history.replaceState(historyState(view, nextSubject.id), '')
  }

  const startModule = (selectedModule) => {
    setModule(selectedModule)
    navigate('quiztype', subject, selectedModule)
  }

  const startQuiz = (selectedType) => {
    navigate(selectedType.id === 'notes' ? 'notes' : 'quiz')
  }

  // quiz-type and quiz screens belong to the Practice tab
  const activeTab = MODULE_VIEWS.includes(view) ? 'practice' : view

  return (
    <div className="app">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3.5" />
        </filter>
      </svg>
      <header className="topbar">
        <button className="logo" onClick={() => navigate('home')}>
          <span className="hl">ExamSprint</span>
        </button>
        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={activeTab === n.id ? 'active' : ''}
              onClick={() => navigate(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="nav courses" role="group" aria-label="Course">
        <span className="courses-label">Course</span>
        {subjects.map((s) => (
          <button
            key={s.id}
            className={s.id === subject.id ? 'active' : ''}
            aria-pressed={s.id === subject.id}
            onClick={() => chooseCourse(s.id)}
          >
            {s.short ?? s.name}
          </button>
        ))}
      </div>

      {view !== 'home' && (
        <button className="btn alt back" onClick={() => history.back()}>
          ← Back
        </button>
      )}

      <main ref={mainRef}>
        {view === 'home' && <Home subject={subject} onNavigate={navigate} />}
        {view === 'practice' && (
          <ModulePicker subject={subject} onSelect={startModule} />
        )}
        {view === 'quiztype' && module && (
          <QuizTypePicker module={module} onSelect={startQuiz} />
        )}
        {view === 'quiz' && module && (
          <Quiz module={module} />
        )}
        {view === 'notes' && module && <Notes module={module} cipher={subject.id === 'datasikkerhet'} />}
        {view === 'review' && <Review key={subject.id} subject={subject} />}
        {view === 'dashboard' && (
          <Dashboard key={subject.id} subject={subject} onNavigate={navigate} />
        )}
      </main>
    </div>
  )
}
