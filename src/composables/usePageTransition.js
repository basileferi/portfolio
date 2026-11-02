import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { sfx } from '@/composables/useSound'

let topEl = null
let bottomEl = null
let labelEl = null
let covered = false
let hasNavigated = false

/** Text shown in the middle of the curtain (destination name). */
export const curtainLabel = ref('KOSMO')

export function registerCurtain(top, bottom, label) {
  topEl = top
  bottomEl = bottom
  labelEl = label
}

/**
 * Seconds a page should wait before playing its intro animation:
 * long on first load (splash preloader), short after a curtain transition.
 */
export function introDelay() {
  return hasNavigated ? 0.45 : 1.55
}

export function enterCurtain(onComplete, label = 'KOSMO') {
  hasNavigated = true
  curtainLabel.value = label
  if (!topEl || !bottomEl) { onComplete?.(); return }

  covered = true
  sfx.whoosh()
  const tl = gsap.timeline({ onComplete })
  tl.to([topEl, bottomEl], { yPercent: 0, duration: 0.65, ease: 'expo.inOut' })
  // Wait for Vue to render the new label characters before animating them.
  nextTick(() => {
    const chars = labelEl.querySelectorAll('.curtain-char')
    tl.set(labelEl, { opacity: 1, y: 0 }, 0.45)
      .fromTo(chars.length ? chars : labelEl,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.4, stagger: 0.012, ease: 'power3.out' }, 0.45)
      .to({}, { duration: 0.1 }) // brief hold so the curtain reads before navigating
  })
}

export function leaveCurtain() {
  if (!topEl || !bottomEl || !covered) return
  covered = false
  sfx.reveal()

  gsap.timeline()
    .to(labelEl, { opacity: 0, y: -12, duration: 0.2, ease: 'power2.in' })
    .to(topEl, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, '-=0.05')
    .to(bottomEl, { yPercent: 100, duration: 0.7, ease: 'expo.inOut' }, '<')
    .call(() => {
      gsap.set(topEl, { yPercent: -100 })
      gsap.set(bottomEl, { yPercent: 100 })
      gsap.set(labelEl, { opacity: 0, y: 10 })
    })
}
