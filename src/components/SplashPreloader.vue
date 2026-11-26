<template>
  <div v-show="visible" id="splash-preloader">
    <!-- Logo centré -->
    <img :src="logo" :alt="t('common.logoAlt')" class="splash-logo" />
    <!-- Barre libre en dessous du logo -->
    <div class="splash-bar-container">
      <div ref="progressBar" class="splash-progress"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import logo from "@/assets/logo/logo_b.png";
import { t } from '@/i18n';
const progressBar = ref(null);
const visible = ref(true);

onMounted(() => {
  // Barre qui se remplit automatiquement sur 2s
  gsap.to(progressBar.value, {
    width: "100%",
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.to("#splash-preloader", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => (visible.value = false)
      });
    }
  });
});

</script>

<style scoped>
#splash-preloader {
  position: fixed;
  inset: 0;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Logo central, gros */
.splash-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 30px;
  animation: pulse 1.2s infinite ease-in-out;
}

/* Barre libre */
.splash-bar-container {
  width: 60%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

/* Barre de progression */
.splash-progress {
  height: 100%;
  width: 0%;
  background-color: white;
  border-radius: 4px;
}

/* Pulse du logo */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
