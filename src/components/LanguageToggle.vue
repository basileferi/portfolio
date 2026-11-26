<template>
  <div class="lang-toggle" role="group" :aria-label="t('lang.group')">
    <button
      v-for="code in LOCALES"
      :key="code"
      type="button"
      class="lang-btn"
      :class="{ active: locale === code }"
      :aria-pressed="locale === code"
      :lang="code"
      :title="locale === code ? tm(`lang.${code}`).label : t('lang.switchTo', { label: tm(`lang.${code}`).label })"
      @click="switchLocale(code)"
    >
      {{ tm(`lang.${code}`).short }}
    </button>
  </div>
</template>

<script setup>
import { LOCALES, locale, switchLocale, t, tm } from '@/i18n'
</script>

<style scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.lang-btn {
  min-width: 2.2rem;
  height: 1.8rem;
  padding: 0 0.55rem;
  border-radius: 999px;
  border: 0;
  background: transparent;
  color: var(--color-subtitle);
  font: 600 0.72rem/1 var(--font-body), sans-serif;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.lang-btn:hover { color: var(--color-text); }

.lang-btn.active {
  background: var(--color-text);
  color: #0c0c0c;
  cursor: default;
}

.lang-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
