<template>
  <nav class="breadcrumb">
    <RouterLink to="/" class="crumb">{{ t('breadcrumb.home') }}</RouterLink>
    <span class="separator">›</span>
    <span class="crumb current">{{ current }}</span>
  </nav>
</template>

<script setup>
import { t } from '@/i18n'
const props = defineProps({
  current: { type: String, required: true }
});
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ccc;
  font-size: 0.9rem;
  margin: 1rem 3rem;
}

.crumb {
  text-decoration: none;
  color: var(--color-accent);
  transition: color 0.2s;
}
.crumb:hover {
  color: var(--color-subtitle);
}

.separator {
  color: #888;
}

.current {
  color: #fff;
}
</style>
