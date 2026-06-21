<template>
  <div
    class="btn-animated"
    :class="wrapperClass"
    @click="emit('click')"
  >
    <button
      class="btn-inner"
      :type="attrs.type ?? 'button'"
    >
      <slot />
    </button>
  </div>
</template>

<script setup>
import { useAttrs, computed } from 'vue'

defineOptions({ inheritAttrs: false })

const emit  = defineEmits(['click'])
const attrs = useAttrs()

const wrapperClass = computed(() => attrs.class)
</script>

<style scoped>
@property --a {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.btn-animated {
  position: relative;
  display: inline-flex;
  border-radius: 999px;
  /* 1.5px padding = visible border thickness */
  padding: 1.5px;
  background: conic-gradient(
    from var(--a),
    transparent 0%,
    transparent 58%,
    rgba(255, 255, 255, 0.85) 73%,
    rgba(255, 255, 255, 0.85) 80%,
    transparent 94%
  );
  animation: snakeSpin 3s linear infinite;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.35s ease;
  cursor: pointer;
}

@keyframes snakeSpin {
  to { --a: 360deg; }
}

.btn-animated:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(137, 126, 255, 0.45));
}

.btn-inner {
  flex: 1;
  border-radius: 999px;
  box-sizing: border-box;
  padding: 0.8rem 2rem;
  background: var(--color-accent);
  color: var(--color-text);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  width: 100%;
  transition: background-color 0.4s ease;
}

.btn-inner:hover {
  background: color-mix(in srgb, var(--color-accent) 72%, #000 28%);
}

.btn-inner svg {
  flex: 0 0 auto;
  display: block;
}
</style>
