import { useEffect, useRef, useState } from 'react'
import { getContent } from '../data/subjects/index.js'
import { shift } from '../lib/caesar.js'
import { illustrations } from './StudyIllustrations.jsx'

// Optional challenge for the security course: lock the notes with a Caesar cipher
// (random key) and find the key with the slider, or let the app brute-force it.
function CipherPanel({ locked, secret, guess, setGuess, onLock, onUnlock }) {
  const timer = useRef(null)
  useEffect(() => () => clearInterval(timer.current), [])

  const solved = locked && guess === secret

  const bruteForce = () => {
    clearInterval(timer.current)
    setGuess(0)
    timer.current = setInterval(() => {
      setGuess((g) => {
        if (g >= secret) {
          clearInterval(timer.current)
          return g
        }
        return g + 1
      })
    }, 140)
  }

  return (
    <div className="terminal cipher-panel">
      <div className="dots">
        <span />
        <span />
        <span />
      </div>

      {!locked ? (
        <>
          <div>$ notes --status</div>
          <div className="ok">✓ plaintext</div>
          <p className="cipher-help">
            Lock the notes with a Caesar cipher and find the key yourself. A random key from 1 to 25 is
            used, so you can crack it by trying them all (brute force).
          </p>
          <div className="actions tight">
            <button className="btn small" onClick={onLock}>
              🔒 Encrypt notes
            </button>
          </div>
        </>
      ) : (
        <>
          <div>$ caesar --decrypt --key {String(guess).padStart(2, '0')}</div>
          <div className={solved ? 'ok' : 'bad'}>
            {solved ? `✓ key found: K = ${secret}. Plaintext recovered.` : '✗ still gibberish. Try another key.'}
          </div>
          <label className="slider">
            <span>Key</span>
            <input
              type="range"
              min="0"
              max="25"
              value={guess}
              onChange={(e) => {
                clearInterval(timer.current)
                setGuess(Number(e.target.value))
              }}
              aria-label="Decryption key, 0 to 25"
            />
            <strong>{guess}</strong>
          </label>
          <div className="actions tight">
            <button className="btn small" onClick={bruteForce} disabled={solved}>
              Brute force it
            </button>
            <button className="btn alt small" onClick={onLock}>
              New key
            </button>
            <button className="btn alt small" onClick={onUnlock}>
              Back to plain text
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Notes({ module, cipher = false }) {
  const content = getContent(module.id)
  const [locked, setLocked] = useState(false)
  const [secret, setSecret] = useState(3)
  const [guess, setGuess] = useState(0)

  if (!content?.notes?.length) {
    return (
      <section>
        <h1>
          Study <span className="hl">notes</span>
        </h1>
        <p className="tagline">No notes for this module yet.</p>
      </section>
    )
  }

  const lock = () => {
    setSecret(1 + Math.floor(Math.random() * 25))
    setGuess(0)
    setLocked(true)
  }

  // text shown = plaintext shifted by (secret - guess): readable exactly when guess === secret
  const show = (s) => (locked ? shift(s, secret - guess) : s)
  const garbled = locked && guess !== secret

  return (
    <section className="notes">
      <h1>
        Study <span className="hl">notes</span>
      </h1>
      <p className="tagline">{module.title}</p>

      {cipher && (
        <CipherPanel
          locked={locked}
          secret={secret}
          guess={guess}
          setGuess={setGuess}
          onLock={lock}
          onUnlock={() => setLocked(false)}
        />
      )}

      {content.notes.map((n) => {
        const Illustration = illustrations[n.illustration]
        return (
          <article key={n.id} className={`note-section ${garbled ? 'garbled' : ''}`}>
            <h2>{show(n.title)}</h2>
            {n.paragraphs?.map((p, i) => (
              <p key={i}>{show(p)}</p>
            ))}
            {n.bullets && (
              <ul>
                {n.bullets.map((b, i) => (
                  <li key={i}>{show(b)}</li>
                ))}
              </ul>
            )}
            {n.example && (
              <div className="terminal example">
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
                {n.example.map((l, i) => (
                  <pre key={i}>{show(l)}</pre>
                ))}
              </div>
            )}
            {Illustration && <Illustration />}
          </article>
        )
      })}

      <p className="note">
        Based on {content.source}. Review these notes alongside your course material.
      </p>
    </section>
  )
}
