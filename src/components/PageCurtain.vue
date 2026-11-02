<template>
  <div aria-hidden="true" class="curtain-wrapper">
    <div ref="topEl" class="curtain-panel curtain-top" />
    <div ref="bottomEl" class="curtain-panel curtain-bottom" />
    <div ref="labelEl" class="curtain-label">
      <span class="curtain-name">
        <span v-for="(ch, i) in chars" :key="i + ch" class="curtain-char">{{ ch === ' ' ? ' ' : ch }}</span>
      </span>
      <span class="curtain-dot">.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { registerCurtain, curtainLabel } from '@/composables/usePageTransition'

const topEl = ref(null)
const bottomEl = ref(null)
const labelEl = ref(null)

const chars = computed(() => [...curtainLabel.value.replace(/\.$/, '')])

onMounted(() => {
  gsap.set(topEl.value, { yPercent: -100 })
  gsap.set(bottomEl.value, { yPercent: 100 })
  gsap.set(labelEl.value, { opacity: 0, y: 10 })
  registerCurtain(topEl.value, bottomEl.value, labelEl.value)
})
</script>

<style scoped>
.curtain-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9000;
  pointer-events: none;
}

.curtain-panel {
  position: absolute;
  left: 0;
  right: 0;
  height: 51vh; /* 51 to avoid 1px gap at seam */
  background: #0c0e0c;
}

.curtain-top { top: 0; }
.curtain-bottom { bottom: 0; }

.curtain-label {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(90vw, 1200px);
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.05em;
  pointer-events: none;
  user-select: none;
  text-align: center;
}

.curtain-name {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 4.5rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  line-height: 1.15;
  color: #f9f9f9;
  text-transform: uppercase;
}

.curtain-char {
  display: inline-block;
  will-change: transform;
}

.curtain-dot {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 4.5rem);
  color: var(--color-accent);
  letter-spacing: 0;
}
</style>
