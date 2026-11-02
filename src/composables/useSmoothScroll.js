import { onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null
export const getLenis = () => lenis

/**
 * The home page (Three.js hero) locks scrolling on <html>/<body>.
 * Content pages unlock it while they are mounted.
 */
export function enablePageScroll() {
  document.documentElement.style.overflowY = 'auto'
  document.body.style.overflowY = 'auto'
  const app = document.getElementById('app')
  if (app) app.style.height = 'auto'
}

export function disablePageScroll() {
  document.documentElement.style.overflowY = 'hidden'
  document.body.style.overflowY = 'hidden'
  const app = document.getElementById('app')
  if (app) app.style.height = '100%'
}

/** Page scroll + Lenis inertia scrolling synced with GSAP ScrollTrigger. */
export function useSmoothScroll({ smooth = true } = {}) {
  let tick = null

  onMounted(() => {
    enablePageScroll()
    window.scrollTo(0, 0)
    if (!smooth || prefersReducedMotion()) return

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    })
    lenis.on('scroll', ScrollTrigger.update)
    tick = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  })

  onBeforeUnmount(() => {
    if (tick) gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
    disablePageScroll()
  })

  return {
    scrollTo(target, options = {}) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -40, duration: 1.4, ...options })
        return
      }
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
      else el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    },
  }
}
