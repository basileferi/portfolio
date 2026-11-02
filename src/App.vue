<template>
  <Splash-Preloader />
  <router-view v-slot="{ Component, route }">
    <!-- keyed by path so going from one project to the next replays the page intro -->
    <component :is="Component" :key="route.path" />
  </router-view>
  <PageCurtain />
</template>

<script setup>
import SplashPreloader from "@/components/SplashPreloader.vue";
import PageCurtain from "@/components/PageCurtain.vue";
</script>
