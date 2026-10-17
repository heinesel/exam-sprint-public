import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { recordAnswer, reviewQueue, summarize } from '../src/lib/review.js'

const values = new Map()
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
  clear: () => values.clear(),
}

beforeEach(() => localStorage.clear())

test('a wrong answer enters review and two correct answers clear it', () => {
  recordAnswer('crypto', 'q1', false)
  assert.equal(reviewQueue(['crypto']).length, 1)

  recordAnswer('crypto', 'q1', true)
  assert.equal(reviewQueue(['crypto']).length, 1)

  recordAnswer('crypto', 'q1', true)
  assert.equal(reviewQueue(['crypto']).length, 0)
})

test('summary calculates attempts, accuracy and review count', () => {
  recordAnswer('crypto', 'q1', true)
  recordAnswer('crypto', 'q2', false)

  const result = summarize([{ id: 'crypto', title: 'Cryptography' }])
  assert.equal(result.answered, 2)
  assert.equal(result.accuracy, 50)
  assert.equal(result.toReview, 1)
})
