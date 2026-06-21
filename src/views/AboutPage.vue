<template>
  <div class="about-page">
    <Header :show-logo="true" />

    <section class="breadcrumb">
      <Breadcrumb current="À propos" />
    </section>

    <main class="content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-text">
            <h1 class="hero-title split-text">
              Votre futur<span class="accent-text"> développeur</span>
            </h1>
            <p class="hero-subtitle split-text">
              Je suis Basile, futur développeur Front-End passionné par les expériences numériques immersives.
            </p>
            <animated-button @click="downloadCV" >
              Télécharger mon CV
              <svg class="icon-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0 0l-4-4m4 4l4-4"/>
              </svg>
            </animated-button>
          </div>
          <div class="hero-visual">
            <div class="hero-graphic">
              <svg class="hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Sections dynamiques alternées -->
      <section class="dynamic-sections">
        <div v-for="(item, index) in dynamicContent" :key="index" class="dynamic-row">
          <!-- badge -->
          <div :class="['badge-number', { 'order-left': index % 2 === 0, 'order-right': index % 2 !== 0 }]">
            {{ String(index + 1).padStart(2, '0') }}
          </div>

          <!-- Colonne texte (alternée) -->
          <div :class="['left-column', { 'order-2': index % 2 !== 0, 'order-1': index % 2 === 0 }]">
            <h2 class="section-title split-text">{{ item.title }}</h2>
            <p class="section-text split-text">{{ item.text }}</p>
            <p class="section-accent">→ {{ item.accent }}</p>
            <div class="projects-vif">
              <RouterLink
                v-if="item.link"
                :to="item.link"
                class="dynamic-link"
            >
              → Mes projets ←
            </RouterLink>
            </div>
          </div>

          <!-- Colonne visuelle (alternée) -->
          <div :class="['right-column', { 'order-1': index % 2 !== 0, 'order-2': index % 2 === 0 }]">
            <div class="section-graphic">
              <div class="graphic-emoji">{{ item.emoji }}</div>
              <p class="graphic-label">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Compétences -->
      <section class="skills-section">
        <h2 class="section-title-center split-text">Mes compétences techniques</h2>
        <div class="skills-grid">
          <div v-for="(skill, index) in skillsData" :key="index" class="skill-card">
            <div class="skill-icon">{{ skill.icon }}</div>
            <h3 class="skill-label">{{ skill.label }}</h3>
            <p class="skill-items">{{ skill.items }}</p>
          </div>
        </div>
      </section>
      <Marquee />

      <!-- Partie Kosmo en bas -->
      <section class="kosmo-section">
        <h2 class="kosmo-title scramble-text">K___?</h2>
        <p class="kosmo-explanation split-text">
          Qu'est ce que Kosmo ? Il s'agit d'un pseudonyme que j'utilise parfois sur internet. J'ai choisi de le nommer ainsi car Kosmo est une partie mon identité sur le Web, tout comme ce portfolio. Ce projet est mon tout premier site utilisant les bibliothèques GSAP et Three.js, j'ai adoré apprendre les bases de ces bibliothèques JavaScript tout au long de son développement.
        </p>
        <p class="kosmo-accent">→ Mon portfolio de futur développeur web</p>
      </section>

      <!-- CTA Final -->
      <section class="cta-final">
        <h3 class="cta-title split-text">Prêt à discuter ?</h3>
        <p class="cta-subtitle"><button @click="modal.openContact()" class="cta-contact-btn"><strong>Contactez-moi </strong></button> ou explorez mon portfolio complet pour découvrir mes derniers projets</p>
        <animated-button @click="modal.openContact()" >
          ME CONTACTER
        </animated-button>
        <RouterLink to="/" class="retour-proj">
          <div class="retour-row">
            <h4 class="projects">Projets</h4>
          </div>
        </RouterLink>
      </section>

      <Marquee />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Marquee from "@/components/Marquee.vue"
import Breadcrumb from '@/components/Breadcrumb.vue'
import cvFile from '@/assets/CV_FERRAND-RICHARTE_Basile.pdf'
import { onMounted } from 'vue'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import AnimatedButton from "@/components/AnimatedButton.vue";

import { useModalStore } from '@/stores/useModalStore'

const modal = useModalStore()

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin)

// Fonction pour télécharger le CV
function downloadCV() {
  const link = document.createElement("a")
  link.href = cvFile
  link.download = "CV_FERRAND-RICHARTE_Basile.pdf"
  link.click()
}

// Contenu des sections dynamiques alternées
const dynamicContent = [
  {
    title: "Bonjour, je m'appelle Basile",
    text: "Je suis étudiant en 2e année de BUT MMI avec une spécialisation en Développement Web. En parallèle de mes études, je me forme continuellement à de nouveaux langages, frameworks et technologies pour créer des expériences web captivantes, performantes et immersives.",
    accent: "Développeur créatif",
    emoji: "📖",
    label: "Apprentissage"
  },
  {
    title: "Mes projets en MMI",
    text: "Dans mes projets de groupe à l’IUT, j’ai souvent été la personne qui fait le lien entre le design et la technique. J’aime imaginer une interface, puis lui donner vie dans le navigateur. Même si ces projets n’étaient pas tous orientés web, ils m’ont permis d’apprendre à travailler efficacement en équipe, à défendre des choix UX/UI, et à traduire des idées en solutions concrètes.",
    accent: "La Technologie au service du design",
    emoji: "🧑‍💻👨‍💻👩‍💻",
    label: "Travail d'équipe",
    link: "/"
  },
  {
    title: "Impact et résultats",
    text: "Je développe des interfaces accessibles, structurées et responsives. Mon but est simple : rendre l’expérience agréable pour l’utilisateur. J’accorde autant d’importance à la qualité du code qu’à l’esthétique du résultat.",
    accent: "Qualité",
    emoji: "✨",
    label: "Impact"
  },
  {
    title: "Ce que je veux construire demain",
    text: "Je veux continuer à progresser en développement web, tout particulièrement en front-end, explorer de nouveaux frameworks et créer des sites plus rapides, plus immersifs, plus utiles. J’apprends un peu chaque jour, dans mes projets d'études comme dans mes projets personnels.",
    accent: "Gagner de l'expérience",
    emoji: "🌄",
    label: "Devenir développeur confirmé"
  }
]

// Données des compétences techniques
const skillsData = [
  {
    icon: "💻",
    label: "Front-End",
    items: "JavaScript, Vue.js (Composition API, Pinia), GSAP, Three, CSS, Tailwind, Bootstrap"
  },
  {
    icon: "👁️",
    label: "UI/UX Design",
    items: "User Flow, Maquettes Figma animées,prototypage UI/UX, Design d'expérience"
  },
  {
    icon: "⚙️",
    label: "Back-end",
    items: "PHP, Node.js"
  },
  {
    icon: "🗃️",
    label: "Base de données",
    items: "SQL, MariaDB (SQL, gestion de bases)"
  },
  {
    icon: "⚡",
    label: "Déploiement",
    items: "Amazon Web Services, Infomaniak, OVH, CI/CD, Git, Github Actions"
  },
  {
    icon: "⌨️",
    label: "SEO",
    items: "HTML, Sémantique, HaloScan"
  },
  {
    icon: "📦",
    label: "Autres",
    items: "Bash, Wordpress, Figma, Adobe Creative Suite, Canva, Blender"
  }
]

// Animations GSAP au montage du composant
onMounted(async () => {
  await document.fonts.ready

  const scroller = '.about-page'

  // ---- Hero: fires immediately on mount ----

  const heroTitleSplit = new SplitText('.hero-title', { type: 'words' })
  gsap.from(heroTitleSplit.words, {
    y: 70,
    opacity: 0,
    rotateX: -60,
    transformPerspective: 1000,
    duration: 1,
    ease: 'back.out(1.5)',
    stagger: { amount: 0.45 },
    delay: 0.1,
    onComplete() { heroTitleSplit.revert() },
  })

  const heroSubSplit = new SplitText('.hero-subtitle', { type: 'lines' })
  gsap.from(heroSubSplit.lines, {
    y: 30,
    opacity: 0,
    duration: 0.75,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.55,
    onComplete() { heroSubSplit.revert() },
  })

  gsap.from(['.hero-text .btn-animated', '.hero-visual'], {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.15,
    delay: 0.9,
    clearProps: 'all',
  })

  // ---- Dynamic rows: columns slide from opposite sides ----
  document.querySelectorAll('.dynamic-row').forEach((row, i) => {
    const xDir    = i % 2 === 0 ? -50 : 50
    const leftCol  = row.querySelector('.left-column')
    const rightCol = row.querySelector('.right-column')
    const badge    = row.querySelector('.badge-number')

    const st = { trigger: row, start: 'top 86%', scroller }

    if (leftCol) gsap.from(leftCol, {
      x: xDir, opacity: 0, duration: 0.85, ease: 'power3.out',
      clearProps: 'all', scrollTrigger: st,
    })
    if (rightCol) gsap.from(rightCol, {
      x: -xDir, opacity: 0, duration: 0.85, ease: 'power3.out', delay: 0.1,
      clearProps: 'all', scrollTrigger: st,
    })
    if (badge) gsap.fromTo(badge,
      { opacity: 0, scale: 0.3, rotation: -25 },
      { opacity: 0.15, scale: 1, rotation: 0, duration: 1, ease: 'back.out(2.2)',
        clearProps: 'transform', scrollTrigger: st }
    )
  })

  // Perpetual float on section graphics
  document.querySelectorAll('.section-graphic').forEach((el, i) => {
    gsap.to(el, {
      y: -12, duration: 2.5 + i * 0.3, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: i * 0.55,
    })
  })

  // ---- Skills section ----
  const skillsTitleSplit = new SplitText('.section-title-center', { type: 'chars' })
  gsap.from(skillsTitleSplit.chars, {
    opacity: 0, y: 40, scale: 0.6,
    duration: 0.6, ease: 'back.out(2)', stagger: { amount: 0.5 },
    scrollTrigger: { trigger: '.section-title-center', start: 'top 86%', scroller },
    onComplete() { skillsTitleSplit.revert() },
  })

  gsap.from('.skill-card', {
    y: 55, opacity: 0, scale: 0.88,
    duration: 0.7, ease: 'back.out(1.8)',
    stagger: { each: 0.07, from: 'start' },
    scrollTrigger: { trigger: '.skills-grid', start: 'top 82%', scroller },
    clearProps: 'all',
  })

  // ---- Other .split-text blocks (skip already-handled hero elements) ----
  const skipSet = new Set([
    ...Array.from(document.querySelectorAll('.hero-title, .hero-subtitle, .section-title-center'))
  ])

  document.querySelectorAll('.split-text').forEach(el => {
    if (skipSet.has(el)) return
    const split = new SplitText(el, { type: 'words' })
    gsap.from(split.words, {
      opacity: 0, y: 22,
      duration: 0.55, ease: 'power2.out', stagger: { amount: 0.3 },
      scrollTrigger: { trigger: el, start: 'top 90%', scroller },
      onComplete() { split.revert() },
    })
  })

  // ---- Kosmo scramble ----
  const kosmo = document.querySelector('.scramble-text')
  if (kosmo) {
    kosmo.textContent = 'K____ ?'
    gsap.to(kosmo, {
      duration: 2.2, scrambleText: 'Kosmo ?', ease: 'power2.inOut',
      scrollTrigger: { trigger: kosmo, start: 'top 88%', scroller },
    })
  }

  // ---- CTA final ----
  gsap.from('.cta-final', {
    y: 35, opacity: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-final', start: 'top 88%', scroller },
    clearProps: 'all',
  })

  ScrollTrigger.refresh()
})

</script>

<style scoped>
.about-page {
  padding: 8rem 3rem 1rem 3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--color-bg);
  height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 3rem 2rem;
  text-align: center;
}

/* Hero Section */
.hero-section {
  width: 100%;
  margin-bottom: 4rem;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.accent-text {
  color: var(--color-accent);
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-subtitle);
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-graphic {
  width: 250px;
  height: 250px;
  border-radius: 1rem;
  border: 2px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(10px);
}

.hero-icon {
  width: 120px;
  height: 120px;
  stroke: var(--color-accent);
  stroke-width: 1.5;
}

.icon-download {
  width: 1.25rem;
  height: 1.25rem;
}

/* Sections dynamiques alternées */
.dynamic-sections {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 5rem;
}

.dynamic-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  padding: 2rem 0;
}

.badge-number {
  position: absolute;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-accent);
  opacity: 0.15;
  top: 0;
  z-index: 0;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
}

.section-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-subtitle);
}

.section-accent {
  font-size: 0.875rem;
  color: var(--color-accent);
  font-weight: 600;
  font-style: italic;
  margin-top: 0.5rem;
}

.right-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.section-graphic {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  border-radius: 1rem;
  border: 2px solid rgba(137, 126, 255, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.section-graphic:hover {
  border-color: rgba(137, 126, 255, 0.85);
  box-shadow: 0 0 35px rgba(137, 126, 255, 0.18),
              inset 0 0 20px rgba(137, 126, 255, 0.06);
}

.graphic-emoji {
  font-size: 3.5rem;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.section-graphic:hover .graphic-emoji {
  transform: scale(1.25) rotate(6deg);
}

.graphic-label {
  font-size: 0.875rem;
  color: var(--color-subtitle);
  font-weight: 600;
}

/* Section Compétences */
.skills-section {
  width: 100%;
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 3rem 0;
}

.section-title-center {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 3rem;
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.skill-card {
  padding: 2rem;
  border: 1px solid rgba(137, 126, 255, 0.35);
  border-radius: 0.75rem;
  background: rgba(139, 92, 246, 0.06);
  text-align: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.35s ease,
              background 0.3s ease,
              border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.skill-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 25%,
    rgba(137, 126, 255, 0.14) 50%,
    transparent 75%
  );
  transform: translateX(-150%);
  pointer-events: none;
  transition: none;
}

.skill-card:hover {
  border-color: rgba(137, 126, 255, 0.8);
  background: rgba(139, 92, 246, 0.14);
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(137, 126, 255, 0.22),
              0 8px 20px rgba(0, 0, 0, 0.3);
}

.skill-card:hover::before {
  transform: translateX(150%);
  transition: transform 0.65s ease;
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.skill-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.skill-items {
  font-size: 0.875rem;
  color: var(--color-subtitle);
  line-height: 1.6;
}

/* Section Kosmo */
.kosmo-section {
  width: 100%;
  max-width: 1200px;
  margin: 5rem auto 0;
  padding: 4rem 3rem;
  text-align: center;
  border-top: 1px solid var(--color-accent);
}

.kosmo-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
}

.kosmo-explanation {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-subtitle);
  max-width: 700px;
  margin: 0 auto 1rem;
}

.kosmo-accent {
  font-size: 0.875rem;
  color: var(--color-accent);
  font-weight: 600;
  font-style: italic;
  margin-top: 1rem;
}

/* CTA Final */
.cta-final {
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto 0;
  padding: 3rem;
  border: 1px solid var(--color-accent);
  border-radius: 1rem;
  background: rgba(139, 92, 246, 0.08);
  backdrop-filter: blur(10px);
  text-align: center;
}

.retour-row {
  padding: 2rem 1rem 0.1rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}

.projects {
  text-transform: uppercase;
  transition: transform 1s ease;
}

.projects:hover {
  transform: scale(93%);
}

.projects-vif {
  transition: all 1.5s ease;
}
.projects-vif:hover {
  transform: translateY(0.2rem);
}


.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1rem;
  color: var(--color-subtitle);
  margin-bottom: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-visual {
    display: none;
  }

  .dynamic-row {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem 0;
  }

  .right-column {
    display: none;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .kosmo-title {
    font-size: 2rem;
  }

  .cta-title {
    font-size: 1.5rem;
  }
}

.cta-contact-btn {
  all: unset;
  cursor: pointer;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  color: var(--color-accent);
}


.cta-contact-btn:hover {
  color: var(--color-text);
}

/* ---- Hero graphic: soft rotating glow ---- */
.hero-graphic {
  position: relative;
}

.hero-graphic::after {
  content: '';
  position: absolute;
  inset: -18px;
  border-radius: calc(1rem + 18px);
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0deg,
    var(--color-accent) 45deg,
    transparent 90deg
  );
  z-index: -1;
  animation: rotateBorder 4s linear infinite;
  filter: blur(16px);
  opacity: 0.7;
}

@keyframes rotateBorder {
  to { --border-angle: 360deg; }
}

@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

/* ---- Badge number: gradient tint ---- */
.badge-number {
  background: linear-gradient(135deg, var(--color-accent) 0%, rgba(137, 126, 255, 0) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.15;
}

/* ---- Dynamic row: accent left border on hover ---- */
.dynamic-row {
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
  transition: border-color 0.4s ease;
}

.dynamic-row:hover {
  border-color: rgba(137, 126, 255, 0.4);
}

/* ---- Custom scrollbar ---- */
.about-page::-webkit-scrollbar { width: 4px; }
.about-page::-webkit-scrollbar-track { background: transparent; }
.about-page::-webkit-scrollbar-thumb { background: rgba(137, 126, 255, 0.3); border-radius: 2px; }
.about-page::-webkit-scrollbar-thumb:hover { background: rgba(137, 126, 255, 0.6); }

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .hero-graphic::after { animation: none; }
  .skill-card, .section-graphic, .graphic-emoji { transition: opacity 0.2s ease; }
}
</style>