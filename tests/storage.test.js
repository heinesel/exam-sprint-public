import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { load, save } from '../src/lib/storage.js'

const values = new Map()
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
  clear: () => values.clear(),
}

beforeEach(() => localStorage.clear())

test('versioned values round-trip through storage', () => {
  save('course', 'datasikkerhet')
  assert.equal(load('course', null), 'datasikkerhet')
})

test('legacy values remain readable', () => {
  localStorage.setItem('examsprint:course', JSON.stringify('ai'))
  assert.equal(load('course', null), 'ai')
})

test('corrupt JSON returns the fallback', () => {
  localStorage.setItem('examsprint:course', '{not json')
  assert.equal(load('course', 'datasikkerhet'), 'datasikkerhet')
})
