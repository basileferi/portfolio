import { gsap } from 'gsap'

let topEl   = null
let bottomEl = null
let labelEl  = null

export function registerCurtain(top, bottom, label) {
  topEl    = top
  bottomEl = bottom
  labelEl  = label
}

export function enterCurtain(onComplete) {
  if (!topEl || !bottomEl) { onComplete?.(); return }

  const tl = gsap.timeline({ onComplete })
  tl.to([topEl, bottomEl], { yPercent: 0, duration: 0.65, ease: 'expo.inOut', stagger: 0 })
    .to(labelEl, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, '-=0.15')
    .to({}, { duration: 0.12 }) // brief hold so the curtain is visible before nav
}

export function leaveCurtain() {
  if (!topEl || !bottomEl) return

  gsap.timeline()
    .to(labelEl, { opacity: 0, y: -8, duration: 0.15, ease: 'power2.in' })
    .to(topEl,    { yPercent: -100, duration: 0.65, ease: 'expo.inOut' }, '-=0.05')
    .to(bottomEl, { yPercent:  100, duration: 0.65, ease: 'expo.inOut' }, '<')
    .call(() => {
      gsap.set(topEl,    { yPercent: -100 })
      gsap.set(bottomEl, { yPercent:  100 })
      gsap.set(labelEl,  { opacity: 0, y: 10 })
    })
}
