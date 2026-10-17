import { createContext, useContext, useId } from 'react'

// Line-art study illustrations. A small amount of color clarifies relationships,
// while paper-filled shapes keep the ruled background from showing through.
const INK = '#1f1f24'
const PAPER = 'var(--paper)'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ArrowMarkerContext = createContext('')

function Frame({ viewBox, title, label, maxWidth, minWidth = '36rem', children }) {
  const uid = useId().replaceAll(':', '')
  const markerId = `study-arrow-${uid}`
  const titleId = `study-title-${uid}`
  const descriptionId = `study-description-${uid}`

  return (
    <ArrowMarkerContext.Provider value={markerId}>
      <div className="study-illustration-frame" tabIndex="0" aria-label={`${title} diagram`}>
        <svg
          className="study-illustration"
          viewBox={viewBox}
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          style={{ fontFamily: 'var(--font-body)', maxWidth, minWidth }}
        >
          <title id={titleId}>{title}</title>
          <desc id={descriptionId}>{label}</desc>
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1 1 L9 5 L1 9" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
    </ArrowMarkerContext.Provider>
  )
}

const line = {
  stroke: INK,
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: PAPER,
}

function Rough({ children, fill = PAPER }) {
  return (
    <g filter="url(#rough)" {...line} fill={fill}>
      {children}
    </g>
  )
}

function Label({ x, y, children, size = 14, weight = 500, anchor = 'middle', mono = false }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={weight}
      fill={INK}
      style={mono ? { fontFamily: 'var(--font-mono)' } : undefined}
    >
      {children}
    </text>
  )
}

function Person({ x, y }) {
  return (
    <Rough>
      <circle cx={x} cy={y} r="13" />
      <path d={`M${x - 20} ${y + 48} Q${x} ${y + 16} ${x + 20} ${y + 48} Z`} />
    </Rough>
  )
}

function Doc({ x, y, s = 1, lines = 3 }) {
  const w = 34 * s
  const h = 46 * s
  const fold = 10 * s
  return (
    <Rough>
      <path d={`M${x} ${y} h${w - fold} l${fold} ${fold} v${h - fold} h${-w} Z`} />
      <path d={`M${x + w - fold} ${y} v${fold} h${fold}`} fill="none" />
      {Array.from({ length: lines }, (_, i) => (
        <path key={i} d={`M${x + 7 * s} ${y + (18 + i * 8) * s} h${(w - 14 * s) * (i === lines - 1 ? 0.6 : 1)}`} fill="none" />
      ))}
    </Rough>
  )
}

function Key({ x, y, scale = 1, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <Rough>
        <circle cx="0" cy="0" r="9" />
        <path d="M9 0 H42 M32 0 V9 M41 0 V7" fill="none" />
      </Rough>
    </g>
  )
}

function Padlock({ x, y, open = false, color = PAPER }) {
  return (
    <Rough fill={color}>
      <rect x={x - 11} y={y} width="22" height="17" rx="3" />
      <path d={open ? `M${x - 7} ${y} V${y - 9} Q${x - 7} ${y - 16} ${x} ${y - 16} Q${x + 7} ${y - 16} ${x + 7} ${y - 11}` : `M${x - 7} ${y} V${y - 6} Q${x - 7} ${y - 14} ${x} ${y - 14} Q${x + 7} ${y - 14} ${x + 7} ${y - 6} V${y}`} fill="none" />
      <circle cx={x} cy={y + 8} r="2" fill={INK} />
    </Rough>
  )
}

function Arrow({ d, dashed = false }) {
  const markerId = useContext(ArrowMarkerContext)
  return (
    <g filter="url(#rough)">
      <path d={d} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dashed ? '6 6' : undefined} markerEnd={`url(#${markerId})`} />
    </g>
  )
}

/* ---------- 1. cryptosystem: Alice, Bob and an eavesdropper ---------- */
export function Cryptosystem() {
  return (
    <Frame viewBox="0 0 640 300" title="A basic cryptosystem" label="Alice encrypts a plaintext with a key, the ciphertext travels to Bob who decrypts it with a key, while Eve the attacker listens in.">
      <Person x={46} y={110} />
      <Label x={46} y={190}>Alice</Label>

      <Doc x={96} y={92} />
      <Label x={113} y={162} size={13}>plaintext</Label>

      <Arrow d="M136 116 H182" />
      <Rough fill="var(--yellow)">
        <rect x="186" y="86" width="96" height="60" rx="12" />
      </Rough>
      <Label x={234} y={122} size={16} weight={600}>encrypt</Label>
      <Key x={206} y={44} scale={0.75} />
      <Label x={234} y={26} size={13}>key</Label>
      <Arrow d="M234 62 V82" />

      <Arrow d="M286 116 H366" />
      <Label x={326} y={102} size={13}>ciphertext</Label>
      <Label x={326} y={138} size={13} mono>x#9&amp;</Label>

      <Rough fill="var(--green)">
        <rect x="370" y="86" width="96" height="60" rx="12" />
      </Rough>
      <Label x={418} y={122} size={16} weight={600}>decrypt</Label>
      <Key x={390} y={44} scale={0.75} />
      <Label x={418} y={26} size={13}>key</Label>
      <Arrow d="M418 62 V82" />

      <Arrow d="M470 116 H508" />
      <Doc x={512} y={92} />
      <Label x={529} y={162} size={13}>plaintext</Label>
      <Person x={600} y={110} />
      <Label x={600} y={190}>Bob</Label>

      {/* Eve listens in on the cable */}
      <Arrow d="M326 214 V152" dashed />
      <Rough fill="var(--pink)">
        <circle cx="326" cy="228" r="13" />
        <path d="M306 276 Q326 244 346 276 Z" />
        <circle cx="320" cy="226" r="2" fill={INK} />
        <circle cx="332" cy="226" r="2" fill={INK} />
        <circle cx="356" cy="204" r="9" />
        <path d="M349 211 L340 220" fill="none" />
      </Rough>
      <Label x={326} y={294} size={13}>Eve (attacker)</Label>
    </Frame>
  )
}

/* ---------- 2. Caesar wheel with K = 3 ---------- */
export function CaesarWheel() {
  const cx = 160
  const cy = 160
  const step = 360 / 26
  return (
    <Frame viewBox="0 0 320 320" title="Caesar cipher wheel" maxWidth="22rem" minWidth="20rem" label="A Caesar cipher wheel with key 3: the outer ring holds the plaintext alphabet and the inner ring is shifted three places, so A becomes D.">
      <Rough>
        <circle cx={cx} cy={cy} r="148" />
        <circle cx={cx} cy={cy} r="112" fill="var(--purple)" />
        <circle cx={cx} cy={cy} r="76" />
      </Rough>
      {ALPHABET.split('').map((letter, i) => (
        <g key={letter}>
          <text
            transform={`rotate(${i * step} ${cx} ${cy})`}
            x={cx}
            y={cy - 123}
            textAnchor="middle"
            fontSize="17"
            fontWeight="700"
            fill={INK}
          >
            {letter}
          </text>
          <text
            transform={`rotate(${i * step} ${cx} ${cy})`}
            x={cx}
            y={cy - 87}
            textAnchor="middle"
            fontSize="15"
            fontWeight="500"
            fill={INK}
          >
            {ALPHABET[(i + 3) % 26]}
          </text>
        </g>
      ))}
      {/* highlight the A to D pair */}
      <g filter="url(#rough)">
        <rect x={cx - 14} y={cy - 146} width="28" height="74" rx="14" fill="none" stroke={INK} strokeWidth="2.5" strokeDasharray="5 5" />
      </g>
      <Label x={cx} y={cy - 10} size={22} weight={700}>K = 3</Label>
      <Label x={cx} y={cy + 20} size={16}>A → D</Label>
      <Label x={cx} y={cy + 40} size={12} weight={400}>outer = plain</Label>
      <Label x={cx} y={cy + 56} size={12} weight={400}>inner = cipher</Label>
    </Frame>
  )
}

/* ---------- 3. symmetric vs asymmetric ---------- */
export function SymmetricAsymmetric() {
  return (
    <Frame viewBox="0 0 640 280" title="Symmetric and asymmetric cryptography" label="Left: symmetric cryptography, Alice and Bob share one key. Right: asymmetric cryptography, Alice locks with Bob's public key and only Bob's private key opens it.">
      <g filter="url(#rough)">
        <path d="M320 20 V262" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="6 8" />
      </g>

      <Label x={160} y={28} size={19} weight={700}>Symmetric</Label>
      <Person x={46} y={116} />
      <Label x={46} y={196} size={14}>Alice</Label>
      <Person x={274} y={116} />
      <Label x={274} y={196} size={14}>Bob</Label>
      <Key x={130} y={66} scale={0.8} />
      <Arrow d="M124 78 L72 104" dashed />
      <Arrow d="M186 78 L248 104" dashed />
      <Arrow d="M80 154 H238" />
      <Padlock x={160} y={134} color="var(--blue)" />
      <Label x={160} y={226} size={13}>the same key locks and unlocks</Label>
      <Label x={160} y={248} size={13} weight={400}>challenge: sharing the key safely</Label>

      <Label x={480} y={28} size={19} weight={700}>Asymmetric</Label>
      <Person x={366} y={116} />
      <Label x={366} y={196} size={14}>Alice</Label>
      <Person x={594} y={116} />
      <Label x={594} y={196} size={14}>Bob</Label>
      <Key x={424} y={66} scale={0.7} />
      <Label x={455} y={52} size={12}>public</Label>
      <Key x={510} y={66} scale={0.7} />
      <Label x={540} y={52} size={12}>private</Label>
      <Arrow d="M392 90 L386 104" dashed />
      <Arrow d="M556 74 L588 104" dashed />
      <Arrow d="M400 154 H558" />
      <Padlock x={480} y={134} color="var(--purple)" />
      <Label x={480} y={226} size={13}>public key locks · private key unlocks</Label>
      <Label x={480} y={248} size={13} weight={400}>only Bob can open the message</Label>
    </Frame>
  )
}

/* ---------- 4. hash function ---------- */
export function HashFunction() {
  return (
    <Frame viewBox="0 0 640 290" title="How a hash function works" label="Inputs of different lengths go into a hash function and always produce an output of the same fixed length.">
      <Doc x={24} y={20} s={0.75} lines={2} />
      <Doc x={24} y={78} s={1.2} lines={4} />
      <Doc x={24} y={158} s={1.7} lines={6} />
      <Label x={46} y={282} size={13}>any length</Label>

      <Arrow d="M66 40 Q120 40 170 66" />
      <Arrow d="M70 114 H168" />
      <Arrow d="M80 200 Q130 190 172 150" />

      <Rough fill="var(--yellow)">
        <path d="M176 56 H310 L274 150 H212 Z" />
        <path d="M212 150 V176 H274 V150" />
      </Rough>
      <Label x={243} y={108} size={20} weight={700}>hash</Label>

      <Arrow d="M243 180 V204" />
      <Rough fill="var(--green)">
        <rect x="178" y="208" width="130" height="36" rx="8" />
      </Rough>
      <Label x={243} y={232} size={15} mono>9f2c…e1a7</Label>
      <Label x={243} y={262} size={13}>fixed length</Label>

      <Label x={350} y={86} size={15} anchor="start" weight={600}>✓ always the same output size</Label>
      <Label x={350} y={116} size={15} anchor="start" weight={600}>✓ same input, same hash</Label>
      <Label x={350} y={146} size={15} anchor="start" weight={600}>✓ one-way: no way back</Label>
      <Label x={350} y={176} size={15} anchor="start" weight={600}>✓ tiny change, new hash</Label>
      <Label x={350} y={214} size={12} anchor="start" weight={400}>(hash value shown is illustrative)</Label>
    </Frame>
  )
}

export const illustrations = {
  cryptosystem: Cryptosystem,
  caesar: CaesarWheel,
  symasym: SymmetricAsymmetric,
  hash: HashFunction,
}
