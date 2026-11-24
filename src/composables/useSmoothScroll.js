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

/**
 * Page scroll + Lenis inertia scrolling synced with GSAP ScrollTrigger.
 * `wrapper`: CSS selector of a page that scrolls inside its own element
 * (About, Legal) instead of the window.
 */
export function useSmoothScroll({ smooth = true, wrapper = null } = {}) {
  let tick = null
  let resizeObserver = null

  onMounted(() => {
    const el = wrapper ? document.querySelector(wrapper) : null
    if (el) el.scrollTop = 0
    else {
      enablePageScroll()
      window.scrollTo(0, 0)
    }
    if (!smooth || prefersReducedMotion()) return

    lenis = new Lenis({
      ...(el ? { wrapper: el, content: el } : {}),
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    })
    lenis.on('scroll', ScrollTrigger.update)
    tick = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // An element wrapper does not resize when its content grows (images…): watch the children.
    if (el && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => lenis?.resize())
      Array.from(el.children).forEach((child) => resizeObserver.observe(child))
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    if (tick) gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
    if (!wrapper) disablePageScroll()
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
