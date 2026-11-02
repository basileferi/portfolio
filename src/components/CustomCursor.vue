<template>
  <div v-if="enabled" class="kc" aria-hidden="true">
    <div ref="ringEl" class="kc-ring" :class="{ 'is-active': active, 'has-label': !!label, 'is-pressed': pressed, 'is-hidden': hidden }">
      <span class="kc-label">{{ label }}</span>
    </div>
    <div ref="dotEl" class="kc-dot" :class="{ 'is-hidden': hidden || !!label }" />
  </div>
</template>

<script setup>
/**
 * Two-part cursor (fast dot + lagging ring). Any element with
 * data-cursor-label="Voir" morphs the ring into a labelled disc.
 * Only on devices with a precise pointer; touch devices keep the native UX.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const enabled = typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ringEl = ref(null)
const dotEl = ref(null)
const label = ref('')
const active = ref(false)
const pressed = ref(false)
const hidden = ref(true)

let moveRing, moveRingY, moveDot, moveDotY

function onMove(e) {
  hidden.value = false
  moveRing(e.clientX)
  moveRingY(e.clientY)
  moveDot(e.clientX)
  moveDotY(e.clientY)
}

function onOver(e) {
  const target = e.target instanceof Element ? e.target.closest('[data-cursor-label], a, button, [role="button"], label, summary') : null
  active.value = !!target
  label.value = target?.getAttribute('data-cursor-label') || ''
}

const onDown = () => { pressed.value = true }
const onUp = () => { pressed.value = false }
const onLeave = () => { hidden.value = true }

onMounted(() => {
  if (!enabled) return
  document.documentElement.classList.add('has-custom-cursor')
  moveRing = gsap.quickTo(ringEl.value, 'x', { duration: 0.5, ease: 'power3' })
  moveRingY = gsap.quickTo(ringEl.value, 'y', { duration: 0.5, ease: 'power3' })
  moveDot = gsap.quickTo(dotEl.value, 'x', { duration: 0.08, ease: 'power2' })
  moveDotY = gsap.quickTo(dotEl.value, 'y', { duration: 0.08, ease: 'power2' })
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  if (!enabled) return
  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerover', onOver)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<style>
html.has-custom-cursor,
html.has-custom-cursor * {
  cursor: none !important;
}
html.has-custom-cursor input,
html.has-custom-cursor textarea,
html.has-custom-cursor select,
html.has-custom-cursor iframe {
  cursor: auto !important;
}
</style>

<style scoped>
.kc-ring,
.kc-dot {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9500;
  pointer-events: none;
  border-radius: 50%;
  will-change: transform;
}

.kc-dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  background: var(--color-text);
  mix-blend-mode: difference;
  transition: opacity 0.2s ease;
}

.kc-ring {
  width: 38px;
  height: 38px;
  margin: -19px 0 0 -19px;
  border: 1px solid rgba(249, 249, 249, 0.45);
  display: grid;
  place-items: center;
  transition:
    width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    margin 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.35s ease,
    border-color 0.35s ease,
    opacity 0.3s ease;
}

.kc-ring.is-active {
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  border-color: var(--color-accent);
  background: rgba(137, 126, 255, 0.12);
}

.kc-ring.has-label {
  width: 92px;
  height: 92px;
  margin: -46px 0 0 -46px;
  border-color: transparent;
  background: var(--color-accent);
}

.kc-ring.is-pressed {
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
}
.kc-ring.has-label.is-pressed {
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
}

.kc-label {
  font-family: var(--font-body), sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0c0c0c;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.kc-ring.has-label .kc-label {
  opacity: 1;
  transform: scale(1);
}

.is-hidden {
  opacity: 0 !important;
}
</style>
