// Keeps text on the ruled lines of the notebook paper.
//
// 1. Block spacing: every block directly inside a page section is given a top and
//    bottom margin that is a whole number of lines, so text that follows a picture,
//    card or button starts on a ruled line again.
// 2. Line position: the paper lines are shifted so they run just under the baseline
//    of the reading font, like writing on lined paper.

// direct children of a page section (not the two-column hero) and of a note section
const BLOCKS = 'main > section:not(.hero):not(.story) > *, main .note-section > *'

// distance from the top of a reading-font line box to its baseline, in px
function baselineOffset() {
  const box = document.createElement('p')
  box.style.cssText =
    'position:absolute;left:-9999px;visibility:hidden;margin:0;padding:0;' +
    'font-family:var(--font-read);font-size:1.3rem;line-height:var(--line-h)'
  box.innerHTML = 'x<span style="display:inline-block;width:0;height:0"></span>'
  document.body.appendChild(box)
  const offset = box.lastChild.getBoundingClientRect().bottom - box.getBoundingClientRect().top
  box.remove()
  return offset
}

function snap(main) {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const line = 2 * rem // matches --line-h: 2rem

  const blocks = [...main.querySelectorAll(BLOCKS)]
  for (const el of blocks) {
    el.style.marginTop = ''
    el.style.marginBottom = ''
  }
  // children first: a parent's height includes its children's margins
  for (const el of blocks.reverse()) {
    const cs = getComputedStyle(el)
    const top = Math.round((parseFloat(cs.marginTop) || 0) / line) * line
    const bottom = parseFloat(cs.marginBottom) || 0
    // exact layout height (works for SVG, ignores rotation, unlike offsetHeight / bounding box)
    const height = parseFloat(cs.height) || 0
    el.style.marginTop = `${top}px`
    el.style.marginBottom = `${Math.ceil((height + bottom) / line - 0.001) * line - height}px`
  }

  // the paper lines are drawn on the last pixel of each cell; place that pixel 1px under the baseline
  const mainTop = main.getBoundingClientRect().top + window.scrollY
  const shift = (((mainTop + baselineOffset() + 2) % line) + line) % line
  document.body.style.backgroundPosition = `0 ${shift}px`
}

export function startGridSnap(main) {
  let frame = 0
  const schedule = () => {
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0
        snap(main)
      })
    }
  }

  const mutations = new MutationObserver(schedule) // new screens, revealed answers (not style changes)
  mutations.observe(main, { childList: true, subtree: true })
  const resizes = new ResizeObserver(schedule)
  resizes.observe(main)
  window.addEventListener('resize', schedule)
  document.fonts?.ready.then(schedule)
  document.fonts?.addEventListener('loadingdone', schedule)
  schedule()

  return () => {
    cancelAnimationFrame(frame)
    mutations.disconnect()
    resizes.disconnect()
    window.removeEventListener('resize', schedule)
    document.fonts?.removeEventListener('loadingdone', schedule)
  }
}
