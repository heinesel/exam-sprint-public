// Home illustration for Datasikkerhet: one clear security symbol supported by
// three equally weighted CIA principles. Keep labels readable at mobile sizes.
const INK = 'var(--ink)'
const PAPER = 'var(--paper)'

const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Principle({ x, letter, label, color }) {
  return (
    <g>
      <g filter="url(#rough)">
        <circle cx={x} cy="370" r="29" fill={color} {...line} />
      </g>
      <text
        x={x}
        y="380"
        textAnchor="middle"
        fontSize="29"
        fontWeight="700"
        fill={INK}
        style={{ fontFamily: 'var(--font-hand)' }}
      >
        {letter}
      </text>
      <text x={x} y="420" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
        {label}
      </text>
    </g>
  )
}

export default function CyberIllustration() {
  return (
    <svg
      className="illustration cyber-illustration"
      viewBox="0 0 480 450"
      role="img"
      aria-labelledby="cyber-title cyber-description"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <title id="cyber-title">The CIA triad protects information</title>
      <desc id="cyber-description">
        A shield and padlock connected to confidentiality, integrity and availability.
      </desc>

      <g filter="url(#rough)">
        <rect x="169" y="20" width="142" height="34" rx="17" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      </g>
      <text x="240" y="43" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="1.5" fill={INK}>
        PROTECT DATA
      </text>

      {/* The shield is the primary shape. The soft blue fill separates it from the ruled paper. */}
      <g filter="url(#rough)" {...line}>
        <path d="M240 68 L352 108 V194 Q352 278 240 326 Q128 278 128 194 V108 Z" fill={PAPER} />
        <path d="M240 91 L330 123 V194 Q330 258 240 300 Q150 258 150 194 V123 Z" fill="var(--blue)" strokeWidth="2.5" />
      </g>

      {/* Padlock */}
      <g filter="url(#rough)" {...line}>
        <path d="M207 181 V157 Q207 128 240 128 Q273 128 273 157 V181" fill="none" strokeWidth="4" />
        <rect x="188" y="181" width="104" height="78" rx="12" fill="var(--yellow)" />
        <circle cx="240" cy="211" r="9" fill={PAPER} />
        <path d="M240 220 V241" fill="none" />
      </g>

      {/* One shared origin makes the relationship between all three principles obvious. */}
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#rough)">
        <path d="M240 302 V326" />
        <path d="M240 326 Q160 326 88 341" />
        <path d="M240 326 V341" />
        <path d="M240 326 Q320 326 392 341" />
      </g>

      <Principle x={88} letter="C" label="Confidentiality" color="var(--blue)" />
      <Principle x={240} letter="I" label="Integrity" color="var(--green)" />
      <Principle x={392} letter="A" label="Availability" color="var(--yellow)" />

      {/* Small accents retain the hand-drawn personality without competing with the diagram. */}
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M92 155 v16 M84 163 h16" />
        <path d="M388 167 v16 M380 175 h16" />
      </g>
    </svg>
  )
}
