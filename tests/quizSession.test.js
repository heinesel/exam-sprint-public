import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSession, present, quizStateIsValid, sessionIsValid } from '../src/lib/quizSession.js'

const levels = ['easy', 'medium', 'hard']
const questions = levels.flatMap((difficulty) =>
  Array.from({ length: 6 }, (_, index) => ({
    id: `${difficulty}-${index}`,
    difficulty,
    text: 'Question',
    options: ['A', 'B', 'C', 'D'],
    correct: 2,
  })),
)

test('buildSession creates a balanced round with unique questions', () => {
  const result = buildSession(questions)

  assert.equal(result.session.length, 15)
  assert.equal(new Set(result.session.map((item) => item.id)).size, 15)
  for (const difficulty of levels) {
    const count = result.session.filter((item) => item.id.startsWith(difficulty)).length
    assert.equal(count, 5)
  }
})

test('present remaps the correct answer after shuffling', () => {
  const question = questions[0]
  const shown = present(question, [2, 0, 3, 1])

  assert.deepEqual(shown.options, ['C', 'A', 'D', 'B'])
  assert.equal(shown.correct, 0)
})

test('session validation rejects an invalid option order', () => {
  const valid = [{ id: questions[0].id, order: [0, 1, 2, 3] }]
  const duplicate = [{ id: questions[0].id, order: [0, 1, 1, 3] }]

  assert.equal(sessionIsValid(valid, questions), true)
  assert.equal(sessionIsValid(duplicate, questions), false)
})

test('quiz state validation rejects corrupt saved progress', () => {
  const state = {
    session: [{ id: questions[0].id, order: [0, 1, 2, 3] }],
    seen: [],
    index: 0,
    picked: null,
    score: 0,
    done: false,
  }

  assert.equal(quizStateIsValid(state, questions), true)
  assert.equal(quizStateIsValid({ ...state, index: 4 }, questions), false)
  assert.equal(quizStateIsValid({ ...state, picked: 9 }, questions), false)
})
