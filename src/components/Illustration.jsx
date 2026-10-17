// Spot illustration for Home: a student sleeping, dreaming that the studying is already done.
const INK = '#1f1f24'

export default function Illustration() {
  return (
    <svg
      className="illustration"
      viewBox="0 0 360 540"
      role="img"
      aria-label="A student sleeping next to a laptop, thinking: I actually remember this?"
    >
      {/* thought bubble */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinejoin="round" fill="var(--paper)">
        <path
          transform="translate(180 95) scale(1.25) translate(-349 -304)"
          d="M262 300 Q250 268 290 266 Q300 246 332 252 Q356 236 382 256 Q420 250 424 284 Q448 296 432 322 Q440 350 408 352 Q392 370 362 356 Q336 372 312 354 Q280 362 272 338 Q250 330 262 300 Z"
        />
        <circle cx="160" cy="215" r="12" />
        <circle cx="146" cy="248" r="7" />
      </g>
      <g fill={INK} fontFamily="var(--font-hand)" fontWeight="700" fontSize="22" textAnchor="middle">
        <text x="180" y="88">I actually</text>
        <text x="180" y="114">remember this?</text>
      </g>

      {/* zzz */}
      <g fill={INK} fontFamily="var(--font-hand)" fontWeight="700">
        <text x="240" y="326" fontSize="24">z</text>
        <text x="262" y="302" fontSize="30">z</text>
        <text x="290" y="270" fontSize="36">Z</text>
      </g>

      {/* pillow, head, blanket */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="52" y="338" width="190" height="124" rx="26" fill="var(--paper)" transform="rotate(-16 147 400)" />
        <circle cx="146" cy="394" r="44" fill="var(--paper)" />
        <path d="M16 474 Q70 420 150 450 Q240 482 346 466 Q354 502 346 528 L16 528 Q8 500 16 474 Z" fill="var(--paper)" />
      </g>

      {/* face */}
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M124 388 q8 8 16 0" />
        <path d="M150 388 q8 8 16 0" />
        <path d="M134 408 q12 10 24 0" />
      </g>

      {/* nightstand and laptop */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M250 500 H350 M262 500 V540 M338 500 V540" fill="none" />
        <g transform="rotate(-8 297 450)">
          <rect x="262" y="410" width="72" height="50" rx="4" fill="var(--paper)" />
          <path d="M250 478 H346 L336 460 H260 Z" fill="var(--paper)" />
        </g>
        <path d="M297 428 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 l12 -5 Z" fill="var(--paper)" strokeWidth="2.5" transform="rotate(-8 297 450)" />
      </g>
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round">
        <path d="M338 394 l3 -9 M352 400 l8 -6 M326 392 l-2 -9" fill="none" />
      </g>
    </svg>
  )
}
