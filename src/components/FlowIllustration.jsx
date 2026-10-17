// Large line-art illustration: the ExamSprint study loop around a clock,
// with a student sleeping while the review queue does the work.
// Black strokes only; shapes are filled with the paper colour.
const INK = '#1f1f24'
const PAPER = 'var(--paper)'

const star = (cx, cy, r) =>
  `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`

function Pill({ x, y, w, label }) {
  return (
    <g>
      <g filter="url(#rough)">
        <rect x={x - w / 2} y={y - 19} width={w} height={38} rx={19} fill={PAPER} stroke={INK} strokeWidth="2.5" />
      </g>
      <text x={x} y={y + 6} textAnchor="middle" fontSize="18" fontWeight="500" fill={INK}>
        {label}
      </text>
    </g>
  )
}

function Doc({ cx, cy, children }) {
  const x = cx - 48
  const y = cy - 62
  return (
    <g>
      <path d={`M${x} ${y} h66 l30 30 v94 h-96 Z`} />
      <path d={`M${x + 66} ${y} v30 h30`} />
      {children}
    </g>
  )
}

function Window({ cx, cy, children }) {
  const x = cx - 70
  const y = cy - 50
  return (
    <g>
      <rect x={x} y={y} width="140" height="100" rx="6" />
      <path d={`M${x} ${y + 20} h140`} />
      <circle cx={x + 14} cy={y + 10} r="2.5" fill={INK} />
      <circle cx={x + 26} cy={y + 10} r="2.5" fill={INK} />
      <circle cx={x + 38} cy={y + 10} r="2.5" fill={INK} />
      {children}
    </g>
  )
}

export default function FlowIllustration() {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6
    return [438 + Math.sin(a) * 100, 391 - Math.cos(a) * 100, 438 + Math.sin(a) * 112, 391 - Math.cos(a) * 112]
  })

  return (
    <svg
      className="illustration-wide"
      viewBox="0 0 1100 830"
      role="img"
      aria-label="The ExamSprint study loop: pick a topic, practice, read why, wrong answers, review queue, two in a row, progress, mastered. A student sleeps while it runs."
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <defs>
        <marker id="arrowhead-wide" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        </marker>
      </defs>

      {/* ---------- arrows ---------- */}
      <g fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrowhead-wide)" filter="url(#rough)">
        <path d="M263 172 Q310 143 355 141" />
        <path d="M523 137 Q565 140 600 165" />
        <path d="M701 275 Q715 300 716 330" />
        <path d="M701 513 Q695 540 674 558" />
        <path d="M545 622 Q520 635 499 640" />
        <path d="M364 640 Q340 638 320 627" />
        <path d="M182 577 Q160 560 150 530" />
        <path d="M154 334 Q158 300 176 278" />
      </g>

      {/* ---------- clock ---------- */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={PAPER}>
        <circle cx="438" cy="391" r="138" />
        <circle cx="438" cy="391" r="122" fill="none" />
        {/* moon */}
        <path d="M405 345 A46 46 0 1 0 412 437 A37 37 0 1 1 405 345 Z" />
        {/* hands */}
        <path d="M438 391 L430 330 L438 308 L446 330 Z" />
        <path d="M438 391 L484 428 L478 436 L432 399 Z" />
        <circle cx="438" cy="391" r="8" />
        <path d={star(487, 358, 12)} />
      </g>
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round">
        {ticks.map((t, i) => (
          <path key={i} d={`M${t[0]} ${t[1]} L${t[2]} ${t[3]}`} />
        ))}
      </g>
      <g fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round">
        <path d="M545 285 Q568 300 578 325" />
        <path d="M553 272 Q580 290 590 318" />
        <path d="M290 460 Q292 490 305 510" />
        <path d="M298 452 Q302 485 316 505" />
      </g>

      {/* ---------- nodes ---------- */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={PAPER}>
        {/* 1 pick a topic */}
        <Doc cx={193} cy={156}>
          <rect x="160" y="136" width="36" height="30" rx="2" />
          <path d="M163 162 l10 -12 l8 8 l6 -6 l9 10" fill="none" />
          <path d="M204 140 h10 M204 152 h10 M204 164 h10" fill="none" />
          <path d="M160 120 h38" fill="none" />
        </Doc>

        {/* 2 practice quiz */}
        <circle cx="438" cy="122" r="58" />
        <path d={star(402, 84, 9)} />
        <path d={star(425, 78, 6)} />

        {/* 3 read why */}
        <Window cx={695} cy={156}>
          <circle cx="660" cy="170" r="17" />
          <path d="M653 190 h14 M656 196 h8" fill="none" />
          <path d="M700 150 h50 M700 164 h50 M700 178 h34" fill="none" />
        </Window>

        {/* 4 wrong answers */}
        <Doc cx={711} cy={397}>
          <path d="M680 380 h32 M680 394 h32" fill="none" />
          <circle cx="738" cy="432" r="19" />
          <path d="M730 424 l16 16 M746 424 l-16 16" fill="none" />
        </Doc>

        {/* 5 review queue */}
        <rect x="570" y="552" width="90" height="62" rx="5" />
        <rect x="560" y="564" width="90" height="62" rx="5" />
        <rect x="550" y="576" width="90" height="62" rx="5" />
        <path d="M564 596 h48 M564 610 h62" fill="none" />

        {/* 6 two in a row */}
        <path d="M385 590 v62 h96" fill="none" />
        <rect x="402" y="618" width="16" height="34" />
        <rect x="428" y="600" width="16" height="52" />
        <rect x="454" y="580" width="16" height="72" />
        <circle cx="474" cy="650" r="22" />
        <path d="M464 650 l8 8 l14 -16" fill="none" />

        {/* 7 progress */}
        <Window cx={250} cy={601}>
          <circle cx="212" cy="622" r="18" />
          <path d="M212 622 V604 M212 622 L228 630" fill="none" />
          <rect x="250" y="628" width="12" height="16" />
          <rect x="268" y="614" width="12" height="30" />
          <rect x="286" y="602" width="12" height="42" />
        </Window>

        {/* 8 mastered */}
        <path d="M161 366 L202 380 V412 Q202 436 161 452 Q120 436 120 412 V380 Z" />
        <path d="M143 408 l13 13 l23 -26" fill="none" strokeWidth="4" />
      </g>

      {/* ---------- pill labels ---------- */}
      <Pill x={191} y={242} w={156} label="pick a topic" />
      <Pill x={438} y={206} w={160} label="practice quiz" />
      <Pill x={686} y={242} w={122} label="read why" />
      <Pill x={707} y={481} w={164} label="wrong answers" />
      <Pill x={605} y={662} w={154} label="review queue" />
      <Pill x={431} y={716} w={122} label="2 in a row" />
      <Pill x={246} y={676} w={116} label="progress" />
      <Pill x={163} y={490} w={124} label="mastered" />

      {/* ---------- sleeping student ---------- */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinejoin="round" fill={PAPER}>
        <path
          transform="translate(953 245) scale(0.95) translate(-349 -304)"
          d="M262 300 Q250 268 290 266 Q300 246 332 252 Q356 236 382 256 Q420 250 424 284 Q448 296 432 322 Q440 350 408 352 Q392 370 362 356 Q336 372 312 354 Q280 362 272 338 Q250 330 262 300 Z"
        />
        <circle cx="920" cy="339" r="13" />
        <circle cx="904" cy="372" r="7" />
      </g>
      <g fill={INK} fontFamily="var(--font-hand)" fontWeight="700" fontSize="22" textAnchor="middle">
        <text x="953" y="240">I actually</text>
        <text x="953" y="266">remember this?</text>
      </g>
      <g fill={INK} fontFamily="var(--font-hand)" fontWeight="700">
        <text x="975" y="424" fontSize="28">z</text>
        <text x="1003" y="402" fontSize="34">z</text>
        <text x="1032" y="372" fontSize="40">Z</text>
      </g>

      {/* blanket (fill, then line) */}
      <path d="M608 800 Q700 650 800 604 Q870 570 960 590 Q1040 612 1100 640 L1100 800 Z" fill={PAPER} />
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={PAPER}>
        <rect x="838" y="436" width="170" height="124" rx="26" transform="rotate(-20 925 500)" />
        <circle cx="928" cy="497" r="46" />
        <path d="M608 800 Q700 650 800 604 Q870 570 960 590 Q1040 612 1100 640" fill="none" />
        <path d="M800 604 Q840 622 868 660" fill="none" />
      </g>
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M905 490 q9 9 18 0" />
        <path d="M933 490 q9 9 18 0" />
        <path d="M916 514 q13 11 26 0" />
      </g>

      {/* nightstand + laptop */}
      <g filter="url(#rough)" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill={PAPER}>
        <path d="M948 750 H1070 M962 750 V810 M1058 750 V810" fill="none" />
        <g transform="rotate(-9 1010 700)">
          <rect x="960" y="648" width="100" height="70" rx="6" />
          <path d="M944 744 H1076 L1060 718 H958 Z" />
          <path d="M964 732 h92" fill="none" />
        </g>
        <path d={star(1010, 680, 15)} transform="rotate(-9 1010 700)" />
      </g>
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M1034 628 l4 -14 M1054 636 l11 -9 M1016 626 l-3 -13" />
      </g>
    </svg>
  )
}
