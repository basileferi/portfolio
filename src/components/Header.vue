<template>
  <header class="header" :class="{ hidden: hiddenHeader, 'dark-text': isProjectPage}">
    <RouterLink to="/" class="top-left" @click="closeMenu">
      <div class="title-row">
        <h3 class="portfolio">KOSMO.</h3>
        <img src="@/assets/logo/logo_b.png" alt="Logo" class="logo" />
      </div>
      <h1 class="name">par BASILE FERRAND-RICHARTE</h1>
    </RouterLink>

    <div
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
    >
      <div class="line top"></div>
      <div class="line bottom"></div>
    </div>

    <!-- Overlay pour fermer le menu en cliquant à l’extérieur -->
    <div
        v-if="menuOpen"
        class="menu-overlay"
        @click="menuOpen = false"
    ></div>



    <!-- center logo + right buttons only when not mobile -->
    <RouterLink to="/" v-if="!isMobile && showLogo" class="top-center" @click="closeMenu">

    </RouterLink>

    <div class="top-right" v-if="!isMobile">
      <RouterLink to="/about" class="about">À PROPOS</RouterLink>
      <animated-button @click="openContact" class="btn-contact">ME CONTACTER</animated-button>
    </div>

    <!-- mobile menu (hamburger) -->
    <nav class="menu" v-if="menuOpen && isMobile" @click.self="menuOpen = false">
      <RouterLink to="/about" class="menu-link" @click="onMenuLinkClick">À PROPOS</RouterLink>
      <button class="menu-link" @click="openContact">ME CONTACTER</button>
    </nav>

    <!-- modal -->
    <transition :css="false" @enter="onModalEnter" @leave="onModalLeave">
      <div v-if="modal.isContactOpen" class="modal-overlay" @click.self="modal.closeContact()">
        <ContactModal @close="modal.closeContact()" />
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import ContactModal from './ContactModal.vue'
import { useRouter } from 'vue-router'
import AnimatedButton from "@/components/AnimatedButton.vue";
import { useModalStore } from '@/stores/useModalStore'
import { gsap } from 'gsap'

const modal = useModalStore()

const props = defineProps({
  showLogo: { type: Boolean, default: false },
  hiddenHeader: { type: Boolean, default: false }
})

const menuOpen = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const isProjectPage = computed(() => {
  return router.currentRoute.value.name === 'project'
})

const router = useRouter()

watch(
    () => router.currentRoute.value.fullPath,
    () => {
      menuOpen.value = false
    }
)

function handleResize() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) menuOpen.value = false // close mobile menu when switching to desktop
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// ---- Modal GSAP transitions ----
function onModalEnter(el, done) {
  const panel = el.querySelector('.modal-content')
  gsap.set(el,    { opacity: 0 })
  gsap.set(panel, { y: 60, opacity: 0, scale: 0.92, rotateX: 8, transformPerspective: 800 })

  gsap.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' })
  gsap.to(panel, {
    y: 0, opacity: 1, scale: 1, rotateX: 0,
    duration: 0.6, delay: 0.08,
    ease: 'back.out(1.5)',
    onComplete: done,
  })
}

function onModalLeave(el, done) {
  const panel = el.querySelector('.modal-content')
  gsap.to(panel, { y: -30, opacity: 0, scale: 0.95, duration: 0.28, ease: 'power2.in' })
  gsap.to(el, { opacity: 0, duration: 0.35, delay: 0.1, ease: 'power2.in', onComplete: done })
}

// helpers
function openContact() {
  modal.openContact()
  menuOpen.value = false
}


function closeMenu() {
  menuOpen.value = false
}

function onMenuLinkClick() {
  // close menu then navigate (RouterLink handles navigation)
  menuOpen.value = false
}
</script>

<style>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 2rem 3rem;
  z-index: 50;
  pointer-events: auto;
  gap: 1rem;
  box-sizing: border-box;
  transition: all 0.5s ease;
}

/* hide header via prop/class when zoom */
.header.hidden {
  opacity: 0;
  transform: translateY(-12px);
  pointer-events: none;
}

.top-left {
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.title-row {
  display: flex; /* h3 + img alignés sur une ligne */
  align-items: center; /* centrage vertical */
  gap: 0.5rem; /* espace entre eux */
}
.top-left .portfolio { font-size: 1.6rem; margin:0; }
.top-left .name { color: var(--color-subtitle); font-size: 0.8rem; margin:0; }

/* center */
.top-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.top-left .logo { height: 2.5rem; object-fit: contain; }

/* right (desktop) */
.top-right { display: flex; gap: 2rem; margin-left: auto;;
  align-items: center; }
.top-right .about,
.top-right .btn-contact {
  cursor: pointer;
;
}

.top-right .about {
  color: var(--color-text);
  transition: color 0.25s ease;
  position: relative;
  letter-spacing: 0.08em;
  text-decoration: none;
}

.top-right .about::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--color-accent);
  transition: width 0.35s cubic-bezier(0.77, 0, 0.175, 1);
}

.top-right .about:hover {
  color: var(--color-accent);
}

.top-right .about:hover::after {
  width: 100%;
}


/* HAMBURGER */
.hamburger {
  /* shown only on mobile by JS v-if, but keep CSS fallback */
  background: transparent;
  border: 0;
  padding: 0;
  margin-left: auto;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 5px;
}
.hamburger .line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text);
  transition: transform .25s ease, opacity .25s ease;
}
.hamburger .short { width: 70%; }
.hamburger .shorter { width: 50%; }

/* MOBILE MENU */
.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 1rem;
  background: var(--color-bg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 8px;
  z-index: 60;
}
.menu .menu-link {
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-accent);
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  text-decoration: none;
  text-align: left;
}
.menu .menu-link:hover { background: var(--color-accent); }

/* modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.7);
  backdrop-filter: blur(0.09rem);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  padding: 2rem;
  box-sizing: border-box;
}

/* small-screen behavior */
@media (max-width: 768px) {
  /* hide desktop groups via JS-controlled v-if, leave CSS safe fallback */
  .top-center, .top-right { display: none !important; }
  .hamburger { display: flex !important; }
  .top-left { align-items: flex-start; }
}

/* accessibility / pointer reset for links inside header */
.header a, .header button { background: transparent; border: none; color: inherit; }

/* HAMBURGER */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
  cursor: pointer;
  width: 26px;
  height: 26px;
  position: relative;
  z-index: 30;
}

.hamburger .line {
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger .line.top {
  width: 100%;
}

.hamburger .line.bottom {
  width: 70%;
}

/* Animation hamburger → croix */
.hamburger.open .line.top {
  transform: rotate(45deg) translateY(5px);
  width: 100%;
}

.hamburger.open .line.bottom {
  transform: rotate(-45deg) translateY(-5px);
  width: 100%;
}

/* MENU OVERLAY (clic extérieur) */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 20;
}

.header.dark-text {
  color: var(--color-bg);
}

/* Mais certains éléments ne suivent pas automatiquement color: inherit */
.header.dark-text .about,
.header.dark-text .portfolio,
.header.dark-text .name {
  color: var(--color-bg) !important;
}

.header.dark-text .hamburger .line {
  background-color: var(--color-bg) !important;
}



</style>
