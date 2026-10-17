// Home illustration for Intro to AI: a model finds patterns that support
// familiar applications such as speech, language and prediction.
const INK = 'var(--ink)'
const PAPER = 'var(--paper)'

const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Application({ x, label, color, children }) {
  return (
    <g>
      <g filter="url(#rough)">
        <circle cx={x} cy="370" r="29" fill={color} {...line} />
      </g>
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
      <text x={x} y="420" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
        {label}
      </text>
    </g>
  )
}

export default function AiIllustration() {
  return (
    <svg
      className="illustration ai-illustration"
      viewBox="0 0 480 450"
      role="img"
      aria-labelledby="ai-title ai-description"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <title id="ai-title">AI finds patterns and supports useful applications</title>
      <desc id="ai-description">
        A network model connected to speech recognition, language translation and prediction.
      </desc>

      <g filter="url(#rough)">
        <rect x="164" y="20" width="152" height="34" rx="17" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      </g>
      <text x="240" y="43" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="1.5" fill={INK}>
        FIND PATTERNS
      </text>

      {/* A simple model chip is the primary shape. */}
      <g filter="url(#rough)" {...line}>
        <rect x="128" y="82" width="224" height="208" rx="34" fill={PAPER} />
        <rect x="151" y="105" width="178" height="162" rx="25" fill="var(--purple)" strokeWidth="2.5" />

        <path d="M104 120 H128 M104 160 H128 M104 200 H128 M104 240 H128" fill="none" />
        <path d="M352 120 H376 M352 160 H376 M352 200 H376 M352 240 H376" fill="none" />
        <path d="M176 58 V82 M218 58 V82 M262 58 V82 M304 58 V82" fill="none" />
      </g>

      {/* Network nodes: multiple inputs connect through a model to useful output patterns. */}
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M184 150 L240 184 L296 142" />
        <path d="M184 150 L190 226 L240 184 L292 226" />
        <path d="M184 150 L292 226 M190 226 L296 142" opacity="0.7" />
      </g>
      <g filter="url(#rough)" stroke={INK} strokeWidth="2.5">
        <circle cx="184" cy="150" r="12" fill="var(--blue)" />
        <circle cx="296" cy="142" r="12" fill="var(--blue)" />
        <circle cx="190" cy="226" r="12" fill="var(--green)" />
        <circle cx="292" cy="226" r="12" fill="var(--green)" />
        <circle cx="240" cy="184" r="17" fill="var(--yellow)" />
      </g>

      {/* A shared connection keeps the three applications visually equal. */}
      <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#rough)">
        <path d="M240 290 V326" />
        <path d="M240 326 Q160 326 88 341" />
        <path d="M240 326 V341" />
        <path d="M240 326 Q320 326 392 341" />
      </g>

      <Application x={88} label="Speech" color="var(--blue)">
        <path d="M75 370 Q82 358 88 370 Q94 382 101 370" />
        <path d="M78 360 V380 M98 360 V380" opacity="0.7" />
      </Application>

      <Application x={240} label="Language" color="var(--purple)">
        <path d="M225 360 H241 Q247 360 247 366 V374 Q247 380 241 380 H236 L230 386 V380 H225 Q219 380 219 374 V366 Q219 360 225 360 Z" />
        <path d="M247 365 H257 Q263 365 263 371 V377 Q263 383 257 383 H254 L250 387" />
      </Application>

      <Application x={392} label="Prediction" color="var(--green)">
        <path d="M377 381 L386 371 L394 376 L407 358" />
        <path d="M398 358 H407 V367" />
      </Application>
    </svg>
  )
}
