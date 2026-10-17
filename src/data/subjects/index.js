import datasikkerhet from './datasikkerhet.json'
import ai from './ai.json'

// To add a subject: drop a new JSON file next to this one and list it here.
export const subjects = [datasikkerhet, ai]

export const defaultSubject = datasikkerhet

// Study notes and questions per module: every JSON file in this folder that has a
// `moduleId` and `questions` is picked up automatically (keyed by module id).
const files = import.meta.glob('./*.json', { eager: true, import: 'default' })
const content = Object.fromEntries(
  Object.values(files)
    .filter((f) => f.moduleId && Array.isArray(f.questions))
    .map((f) => [f.moduleId, f]),
)

export const getContent = (moduleId) => content[moduleId] ?? null

export const getQuestion = (moduleId, questionId) =>
  content[moduleId]?.questions.find((q) => q.id === questionId) ?? null
