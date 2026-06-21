<template>
  <Splash-Preloader />
  <router-view />
  <PageCurtain />
</template>

<script setup>
import SplashPreloader from "@/components/SplashPreloader.vue";
import PageCurtain from "@/components/PageCurtain.vue";
</script>