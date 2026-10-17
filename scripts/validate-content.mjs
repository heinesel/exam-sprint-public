import fs from 'node:fs'
import path from 'node:path'

const directory = path.resolve('src/data/subjects')
const filenames = fs.readdirSync(directory).filter((name) => name.endsWith('.json'))
const files = filenames.map((name) => ({
  name,
  data: JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')),
}))

const subjects = files.filter(({ data }) => data.id && Array.isArray(data.modules))
const contents = files.filter(({ data }) => data.moduleId)
const errors = []
const warnings = []

const moduleOwners = new Map()
for (const { name, data: subject } of subjects) {
  for (const module of subject.modules) {
    if (!module.id || !module.title) errors.push(`${name}: every module needs id and title`)
    if (moduleOwners.has(module.id)) errors.push(`${name}: duplicate module id "${module.id}"`)
    moduleOwners.set(module.id, { name, module })
  }
}

const contentIds = new Set()
for (const { name, data: content } of contents) {
  if (contentIds.has(content.moduleId)) errors.push(`${name}: duplicate content for "${content.moduleId}"`)
  contentIds.add(content.moduleId)
  if (!moduleOwners.has(content.moduleId)) errors.push(`${name}: moduleId "${content.moduleId}" is not in a subject`)
  if (!content.source) errors.push(`${name}: source is required`)
  if (!Array.isArray(content.notes)) errors.push(`${name}: notes must be an array`)
  if (!Array.isArray(content.questions) || !content.questions.length) {
    errors.push(`${name}: questions must be a non-empty array`)
    continue
  }

  const questionIds = new Set()
  const counts = { easy: 0, medium: 0, hard: 0 }
  for (const [index, question] of content.questions.entries()) {
    const at = `${name}: question ${index + 1}`
    if (!question.id || questionIds.has(question.id)) errors.push(`${at}: id is missing or duplicated`)
    questionIds.add(question.id)
    if (!(question.difficulty in counts)) errors.push(`${at}: invalid difficulty`)
    else counts[question.difficulty] += 1
    if (!question.text?.trim()) errors.push(`${at}: text is required`)
    if (!Array.isArray(question.options) || question.options.length < 2) errors.push(`${at}: at least two options are required`)
    if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct >= question.options?.length) {
      errors.push(`${at}: correct must point to an option`)
    }
    if (!question.explanation?.trim() || !question.explanationNo?.trim()) {
      errors.push(`${at}: English and Norwegian explanations are required`)
    }
  }

  for (const [level, count] of Object.entries(counts)) {
    if (count < 5) warnings.push(`${name}: only ${count} ${level} question(s); a full balanced round needs 5`)
  }
}

for (const [moduleId, { name, module }] of moduleOwners) {
  if (!contentIds.has(moduleId) && !module.comingSoon) {
    errors.push(`${name}: module "${moduleId}" has no content; add content or mark comingSoon`)
  }
}

for (const warning of warnings) console.warn(`Warning: ${warning}`)
if (errors.length) {
  for (const error of errors) console.error(`Error: ${error}`)
  process.exitCode = 1
} else {
  console.log(`Content valid: ${subjects.length} subjects and ${contents.length} content modules.`)
}
