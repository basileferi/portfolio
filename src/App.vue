<template>
  <Splash-Preloader />
  <router-view v-slot="{ Component, route }">
    <!-- keyed by path so going from one project to the next replays the page intro -->
    <component :is="Component" :key="route.path" />
  </router-view>
  <PageCurtain />
  <CustomCursor />
  <!-- projects pages already place the toggle in their own toolbar -->
  <SoundToggle v-if="showSoundToggle" class="global-sound" :show-label="false" />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import SplashPreloader from "@/components/SplashPreloader.vue";
import PageCurtain from "@/components/PageCurtain.vue";
import CustomCursor from "@/components/CustomCursor.vue";
import SoundToggle from "@/components/SoundToggle.vue";
import { sfx } from "@/composables/useSound";

const route = useRoute();
// projects pages have their own toolbar toggle and sound design; the admin stays silent
const ownSound = computed(() => ["projects", "project", "admin"].includes(route.name));
const showSoundToggle = computed(() => !!route.name && !ownSound.value);

// Same hover / click sounds as the projects pages, on every interactive element of the site.
const INTERACTIVE = 'a, button, [role="button"], [data-cursor-label], summary, label';
let lastHovered = null;

function onOver(e) {
  if (ownSound.value) return;
  const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
  if (el && el !== lastHovered) sfx.hover(e);
  lastHovered = el;
}

function onClick(e) {
  if (ownSound.value) return;
  if (e.target instanceof Element && e.target.closest(INTERACTIVE)) sfx.click(e);
}

onMounted(() => {
  document.addEventListener("pointerover", onOver, { passive: true });
  document.addEventListener("click", onClick, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerover", onOver);
  document.removeEventListener("click", onClick);
});
</script>

<style scoped>
.global-sound {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 50;
}
</style>
