<template>
  <div class="hero-section">
    <section class="hero" :class="{ zoomed: isZoomed }">
      <canvas id="bgCanvas"></canvas>
      <div class="film-grain"></div>

      <!-- Project navigation (desktop, visible when zoomed) -->
      <nav v-if="isZoomed" class="projects-nav">
        <ul>
          <li
            v-for="project in projectsData"
            :key="project.title"
            @mouseenter="showPreview(project)"
            @mouseleave="clearPreview()"
            @click="navigateToProject(project)"
            class="nav-item"
          >
            <span class="nav-index">{{ String(projectsData.indexOf(project) + 1).padStart(2, '0') }}</span>
            <span class="nav-title">{{ project.title }}</span>
            <span class="nav-arrow">→</span>
          </li>
        </ul>
      </nav>

      <!-- Hero content (center) -->
      <div class="content">
        <h1 class="headline">Bienvenue</h1>
        <h2 class="subtitle">DANS MON ESPACE</h2>
        <AnimatedButton ref="ctaBtn" class="cta" @click="handleClick">
          Mes projets
        </AnimatedButton>
      </div>

      <!-- Bottom corners -->
      <div class="bottom-container">
        <RouterLink to="/about" class="bottom-left">
          <p class="display">Développeur Web</p>
          <p class="location">Grenoble, France</p>
        </RouterLink>
        <RouterLink to="/about" class="bottom-right">
          <p class="quick-desc">
            Étudiant apprenti Développeur Front-end,<br>
            je me forme continuellement en réalisant des projets web divers.<br>
            Toujours curieux d'apprendre de nouvelles technologies.
          </p>
        </RouterLink>
      </div>

      <!-- Back button (visible when zoomed) -->
      <button v-if="isZoomed" class="btn back-btn" @click="handleBack">← Retour</button>

      <!-- Mobile project grid -->
      <ProjectsGrid v-if="isZoomed && isMobile" />
    </section>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import initThreeBackground from '../threeBackground.js';
import createProjectWindow from '../three/projectWindow.js';
import projectsData from '../data/projects.js';
import ProjectsGrid from './ProjectsGrid.vue';
import AnimatedButton from '@/components/AnimatedButton.vue';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

const emit   = defineEmits(['hide-header', 'show-header']);
const router = useRouter();
const ctaBtn = ref(null);

const isMobile = ref(window.innerWidth <= 768);
const isZoomed = ref(false);
let three         = null;
let projectWindow = null;

// ---- Responsive ----
const handleResize = () => { isMobile.value = window.innerWidth <= 768; };
onMounted(()   => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));

// ---- Navigation ----
function navigateToProject(project) {
  if (project.slug) {
    router.push({ name: 'project', params: { slug: project.slug } });
  } else if (project.link) {
    window.open(project.link, '_blank');
  }
}

function navigateBySlug(slugOrUrl) {
  if (!slugOrUrl) return;
  if (slugOrUrl.startsWith('http') || slugOrUrl.startsWith('/projects/')) {
    window.open(slugOrUrl, '_blank');
  } else {
    router.push({ name: 'project', params: { slug: slugOrUrl } });
  }
}

function onOpenProjectEvent(e) {
  navigateBySlug(e?.detail?.slug);
}

// ---- Toggle projects view ----
const toggleProjects = () => {
  if (!three) return;
  const tl = gsap.timeline();

  if (!isZoomed.value) {
    isZoomed.value = true;

    if (!isMobile.value) {
      if (!projectWindow) {
        projectWindow = createProjectWindow(three.scene, 3.5, 2.5, { x: -0.2, y: 0.1 });
      }
      projectWindow.open();
    }

    tl.to(three.camera.position, { z: 2.5, duration: 1.5, ease: 'power2.inOut' })
      .to(three.grainPass.uniforms.intensity,     { value: 0.04, duration: 1, ease: 'power1.inOut' }, 0)
      .to(three.scanlinePass.uniforms.intensity,  { value: 0.22, duration: 1, ease: 'power1.inOut' }, 0)
      .to(three.vignettePass.uniforms.darkness,   { value: 0.38, duration: 1.2, ease: 'power2.out' }, 0)
      .to(three.chromaticPass.uniforms.intensity, { value: 0.009, duration: 1, ease: 'power1.inOut' }, 0)
      .to('.content', { opacity: 0, scale: 0.92, duration: 0.9, ease: 'power2.inOut' }, '<');

  } else {
    isZoomed.value = false;

    if (!isMobile.value && projectWindow) projectWindow.close();

    tl.to(three.camera.position, { z: 6, duration: 1.5, ease: 'power2.inOut' })
      .to(three.grainPass.uniforms.intensity,     { value: 0.06, duration: 1, ease: 'power1.inOut' }, 0)
      .to(three.scanlinePass.uniforms.intensity,  { value: 0.1,  duration: 1, ease: 'power1.inOut' }, 0)
      .to(three.vignettePass.uniforms.darkness,   { value: 1.2,  duration: 1.2, ease: 'power2.inOut' }, 0)
      .to(three.chromaticPass.uniforms.intensity, { value: 0.0015, duration: 1, ease: 'power1.inOut' }, 0)
      .to('.content', { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, '<');
  }
};

function handleClick() {
  emit('hide-header');
  toggleProjects();
}

function handleBack() {
  emit('show-header');
  toggleProjects();
}

// ---- 3D preview panel ----
function showPreview(project) {
  if (projectWindow) {
    projectWindow.hidePlaceholder();
    projectWindow.updatePreview(project.preview);
  }
}

function clearPreview() {
  if (projectWindow) projectWindow.clearPreview();
}

// ---- Mounted ----
onMounted(() => {
  window.addEventListener('openProject', onOpenProjectEvent);
  three = initThreeBackground();
  if (!three) return;

  document.fonts.ready.then(() => {
    const split = new SplitText('.headline', { type: 'chars' });
    const tl    = gsap.timeline({ delay: 1.3 });

    tl.from(split.chars, {
      y: 70,
      opacity: 0,
      scale: 0.85,
      rotation: 8,
      duration: 1,
      ease: 'expo.out',
      stagger: { amount: 0.45 },
    })
    .from('.subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .fromTo('.cta',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out', clearProps: 'all' },
    '-=0.4');

    // Bottom corners slide in from opposite sides
    const splitBL = new SplitText('.bottom-left', { type: 'chars' });
    tl.from(splitBL.chars, {
      x: -40, y: 30, opacity: 0, scale: 0.9, rotation: 4,
      duration: 0.6, ease: 'power3.out', stagger: { amount: 0.3 },
    }, '-=0.6');

    const splitBR = new SplitText('.bottom-right', { type: 'chars' });
    tl.from(splitBR.chars, {
      x: 40, y: 30, opacity: 0, scale: 0.9, rotation: -4,
      duration: 0.6, ease: 'power3.out', stagger: { amount: 0.3 },
    }, '<');
  });
});

onUnmounted(() => {
  window.removeEventListener('openProject', onOpenProjectEvent);
});
</script>


<style scoped>

.hero-section,
#bgCanvas {
  width: 100%;
  height: 100%;
}

.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

canvas#bgCanvas {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}

/* ---- Film grain overlay ---- */
.film-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.1;
  background: repeating-radial-gradient(
    circle at 0 0,
    rgba(0,0,0,0.04) 0,
    rgba(0,0,0,0.04) 1px,
    transparent 1px,
    transparent 2px
  );
  animation: grainShift 0.5s steps(6) infinite;
}

@keyframes grainShift {
  0%,100% { transform: translate(0,0); }
  20%      { transform: translate(-1%,1%); }
  40%      { transform: translate(1%,-1%); }
  60%      { transform: translate(-1%,-1%); }
  80%      { transform: translate(1%,1%); }
}

/* ---- Hero content ---- */
.content {
  position: relative;
  text-align: center;
  z-index: 2;
  color: var(--color-text);
}

.headline {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 0.5rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 0.5rem;
  color: var(--color-subtitle);
  letter-spacing: 0.25rem;
}

.cta {
  margin-top: 2rem;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

/* ---- Bottom corners ---- */
.bottom-container {
  position: absolute;
  bottom: 3rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 0 3rem;
  z-index: 5;
}

.bottom-left,
.bottom-right {
  z-index: 5;
  transition: opacity 0.5s ease, transform 0.5s ease;
  max-width: 45%;
  color: var(--color-text);
}

.bottom-right {
  text-align: end;
  max-width: 40%;
}

.hero.zoomed .bottom-left,
.hero.zoomed .bottom-right {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.9);
}

.display  { font-size: 2.1rem; }
.location { color: var(--color-subtitle); font-size: 0.85rem; margin-top: 0.2rem; }
.quick-desc { font-size: 0.85rem; line-height: 1.6; color: var(--color-subtitle); }

/* ---- Back button ---- */
.btn {
  position: relative;
  text-transform: uppercase;
  transition: all 0.2s ease;
  z-index: 2;
  border-radius: 999px;
}

.back-btn {
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.6rem 1.4rem;
  pointer-events: auto;
  z-index: 10;
  font-size: 0.8rem;
  font-family: var(--font-body), sans-serif;
  color: var(--color-text);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 0.8s 0.6s forwards;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
}

.back-btn:hover {
  background: rgba(137,126,255,0.15);
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateX(-3px);
}

@keyframes fadeIn { to { opacity: 1; } }

/* ---- Project navigation ---- */
.projects-nav {
  position: absolute;
  top: 50%;
  right: 3rem;
  transform: translateY(-50%);
  z-index: 20;
  pointer-events: auto;
}

.projects-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.25s ease;
  color: var(--color-text);
  opacity: 0;
  animation: slideInRight 0.4s ease forwards;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.18s; }
.nav-item:nth-child(3) { animation-delay: 0.26s; }
.nav-item:nth-child(4) { animation-delay: 0.34s; }
.nav-item:nth-child(5) { animation-delay: 0.42s; }
.nav-item:nth-child(6) { animation-delay: 0.50s; }
.nav-item:nth-child(7) { animation-delay: 0.58s; }

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.nav-item:hover {
  background: rgba(137,126,255,0.1);
  transform: translateX(-4px);
}

.nav-index {
  font-size: 0.65rem;
  color: var(--color-accent);
  font-family: var(--font-body), monospace;
  opacity: 0.7;
  min-width: 1.5rem;
}

.nav-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  flex: 1;
  transition: color 0.2s ease;
}

.nav-item:hover .nav-title { color: var(--color-accent); }

.nav-arrow {
  font-size: 0.75rem;
  color: var(--color-accent);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nav-item:hover .nav-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ---- Responsive ---- */
@media (max-width: 1024px) {
  .bottom-left { font-size: 0.8rem; }
  .bottom-right { font-size: 0.8rem; max-width: 60%; text-align: left; }
}

@media (max-width: 768px) {
  .headline   { font-size: 2.4rem; font-weight: 800; color: var(--color-accent); }
  .subtitle   { font-size: 1rem; margin-top: 0.5rem; }
  .bottom-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0 1rem;
  }
  .bottom-left  { font-size: 0.7rem; max-width: 100%; }
  .bottom-right { font-size: 0.7rem; max-width: 100%; text-align: left; }
  .quick-desc   { font-size: 0.65rem; line-height: 1rem; }
  .hero.zoomed .content { display: none; }
  .projects-nav { display: none; }
  .back-btn { top: 1rem; left: 1rem; font-size: 0.75rem; }
}

/* Disable CTA inside content when zoomed */
.hero.zoomed .content .btn {
  pointer-events: none;
  opacity: 0.6;
}
</style>
