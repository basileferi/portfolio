<template>
  <button
    type="button"
    class="sound-toggle"
    :class="{ on: soundEnabled }"
    :aria-pressed="soundEnabled"
    :aria-label="soundEnabled ? 'Couper le son' : 'Activer le son'"
    :title="soundEnabled ? 'Son activé' : 'Son coupé'"
    @click="toggleSound"
  >
    <span class="bars" aria-hidden="true">
      <i v-for="n in 4" :key="n" :style="{ animationDelay: `${n * -0.17}s` }" />
    </span>
    <span v-if="showLabel" class="txt">{{ soundEnabled ? 'Son' : 'Muet' }}</span>
  </button>
</template>

<script setup>
import { soundEnabled, toggleSound } from '@/composables/useSound'

defineProps({ showLabel: { type: Boolean, default: true } })
</script>

<style scoped>
.sound-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  height: 2.5rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(19, 20, 19, 0.6);
  color: var(--color-text);
  font: 600 0.72rem/1 var(--font-body), sans-serif;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}
.sound-toggle:hover,
.sound-toggle:focus-visible {
  border-color: var(--color-accent);
}
.sound-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}
.bars i {
  display: block;
  width: 2px;
  height: 100%;
  background: currentColor;
  border-radius: 1px;
  transform-origin: bottom;
  transform: scaleY(0.18);
  transition: transform 0.4s ease;
}
.on .bars i {
  background: var(--color-accent);
  animation: eq 0.9s ease-in-out infinite alternate;
}

@keyframes eq {
  0% { transform: scaleY(0.2); }
  35% { transform: scaleY(1); }
  70% { transform: scaleY(0.45); }
  100% { transform: scaleY(0.8); }
}

@media (prefers-reduced-motion: reduce) {
  .on .bars i { animation: none; transform: scaleY(0.7); }
}
</style>
