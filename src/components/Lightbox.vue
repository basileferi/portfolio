<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      ref="rootEl"
      class="lb"
      role="dialog"
      aria-modal="true"
      :aria-label="`${title} — image ${index + 1} sur ${images.length}`"
      @keydown="onKey"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div class="lb-backdrop" @click="close" />

      <header class="lb-bar">
        <p class="lb-title">{{ title }}</p>
        <p class="lb-count" aria-live="polite">
          <span>{{ pad(index + 1) }}</span> / {{ pad(images.length) }}
        </p>
        <button ref="closeBtn" type="button" class="lb-close" aria-label="Fermer (Échap)" data-cursor-label="Fermer" @click="close">
          <span aria-hidden="true">✕</span>
        </button>
      </header>

      <div class="lb-stage" @click.self="close">
        <img
          ref="imgEl"
          :key="images[index]"
          :src="images[index]"
          :alt="`${title} — image ${index + 1}`"
          class="lb-img"
          draggable="false"
        />
      </div>

      <template v-if="images.length > 1">
        <button type="button" class="lb-nav lb-prev" aria-label="Image précédente (←)" data-cursor-label="Préc." @click="go(-1)">←</button>
        <button type="button" class="lb-nav lb-next" aria-label="Image suivante (→)" data-cursor-label="Suiv." @click="go(1)">→</button>

        <nav class="lb-thumbs" aria-label="Miniatures">
          <button
            v-for="(src, i) in images"
            :key="src + i"
            type="button"
            class="lb-thumb"
            :class="{ active: i === index }"
            :aria-label="`Afficher l'image ${i + 1}`"
            :aria-current="i === index"
            @click="goTo(i)"
          >
            <img :src="src" alt="" loading="lazy" />
          </button>
        </nav>
      </template>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { sfx } from '@/composables/useSound'
import { getLenis, prefersReducedMotion } from '@/composables/useSmoothScroll'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  images: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 },
  title: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const index = ref(0)
const rootEl = ref(null)
const imgEl = ref(null)
const closeBtn = ref(null)
let lastFocus = null
let closing = false
let touchX = null

const pad = (n) => String(n).padStart(2, '0')
const reduced = prefersReducedMotion()

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    index.value = Math.min(Math.max(props.startIndex, 0), Math.max(props.images.length - 1, 0))
    lastFocus = document.activeElement
    closing = false
    getLenis()?.stop()
    document.addEventListener('keydown', onKey)
    sfx.open()
    await nextTick()
    closeBtn.value?.focus({ preventScroll: true })
    if (reduced) return
    gsap.fromTo(rootEl.value.querySelector('.lb-backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    gsap.fromTo(imgEl.value, { clipPath: 'inset(12% 12% 12% 12% round 18px)', scale: 1.08, opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0% round 10px)', scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' })
    gsap.from(rootEl.value.querySelectorAll('.lb-bar > *, .lb-nav, .lb-thumb'), { y: 16, opacity: 0, duration: 0.6, stagger: 0.025, ease: 'power3.out', delay: 0.1 })
  },
)

function finishClose() {
  document.removeEventListener('keydown', onKey)
  getLenis()?.start()
  emit('update:modelValue', false)
  lastFocus?.focus?.({ preventScroll: true })
}

function close() {
  if (closing) return
  closing = true
  sfx.close()
  if (reduced || !rootEl.value) return finishClose()
  gsap.to(rootEl.value, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: finishClose })
}

async function goTo(i, direction = i > index.value ? 1 : -1) {
  if (i === index.value) return
  sfx.swipe(direction)
  index.value = (i + props.images.length) % props.images.length
  await nextTick()
  if (!reduced && imgEl.value) {
    gsap.fromTo(imgEl.value, { x: 60 * direction, opacity: 0, scale: 0.98 }, { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' })
  }
  rootEl.value?.querySelector('.lb-thumb.active')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
}

const go = (dir) => goTo((index.value + dir + props.images.length) % props.images.length, dir)

function onKey(e) {
  if (!props.modelValue) return
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
  else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); go(1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); go(-1) }
  else if (e.key === 'Tab' && rootEl.value) {
    // Keep focus inside the dialog.
    const focusables = [...rootEl.value.querySelectorAll('button')]
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

function onTouchStart(e) { touchX = e.changedTouches[0].clientX }
function onTouchEnd(e) {
  if (touchX === null) return
  const dx = e.changedTouches[0].clientX - touchX
  touchX = null
  if (Math.abs(dx) > 50 && props.images.length > 1) go(dx < 0 ? 1 : -1)
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  getLenis()?.start()
})
</script>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 8000;
  display: grid;
  grid-template-rows: auto 1fr auto;
  color: var(--color-text);
}
.lb-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(8, 9, 8, 0.94);
  backdrop-filter: blur(14px);
}

.lb-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem clamp(1rem, 3vw, 2.5rem);
}
.lb-title {
  flex: 1;
  font-family: var(--font-display), sans-serif;
  font-size: 1rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lb-count {
  font-size: 0.85rem;
  color: var(--color-subtitle);
  font-variant-numeric: tabular-nums;
}
.lb-count span { color: var(--color-text); }

.lb-close,
.lb-nav {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text);
  font-size: 1.1rem;
  transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.lb-close:hover,
.lb-nav:hover,
.lb-close:focus-visible,
.lb-nav:focus-visible {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #0c0c0c;
  outline: none;
}

.lb-stage {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 0;
  padding: 0 clamp(1rem, 7vw, 6rem);
}
.lb-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  user-select: none;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6);
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.lb-prev { left: clamp(0.5rem, 2vw, 2rem); }
.lb-next { right: clamp(0.5rem, 2vw, 2rem); }

.lb-thumbs {
  position: relative;
  display: flex;
  gap: 0.5rem;
  justify-content: safe center;
  overflow-x: auto;
  padding: 1rem clamp(1rem, 3vw, 2.5rem) 1.5rem;
  scrollbar-width: none;
}
.lb-thumb {
  flex: 0 0 auto;
  width: 4.5rem;
  height: 3rem;
  padding: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid transparent;
  opacity: 0.4;
  background: #222;
  transition: opacity 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.lb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.lb-thumb:hover { opacity: 0.8; }
.lb-thumb.active { opacity: 1; border-color: var(--color-accent); transform: translateY(-3px); }
.lb-thumb:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

@media (max-width: 768px) {
  .lb-title { font-size: 0.85rem; }
  .lb-nav { top: auto; bottom: 5.5rem; transform: none; width: 2.6rem; height: 2.6rem; }
  .lb-stage { padding: 0 0.75rem; }
}
</style>
