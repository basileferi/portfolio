<template>
  <div ref="root" class="pp">
    <CustomCursor />
    <div class="pp-progress" aria-hidden="true"><span ref="progressBar" /></div>
    <Header :show-logo="true" />

    <div v-if="isPreview" class="pp-draft" role="status">Aperçu d'un brouillon — non visible du public</div>

    <main v-if="project" id="contenu" class="pp-main">
      <!-- ================= HERO ================= -->
      <header class="pp-hero">
        <div class="pp-hero-top" data-hero>
          <RouterLink to="/projects" class="pp-crumb" @mouseenter="sfx.hover($event)" @click="sfx.click($event)">
            <span aria-hidden="true">←</span> Tous les projets
          </RouterLink>
          <span class="pp-hero-meta">
            <span class="pp-kbd" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> naviguer · <kbd>Échap</kbd> index</span>
            <span v-if="nav.index > -1" class="pp-counter" aria-label="Position du projet">
              {{ pad(nav.index + 1) }}<span> / {{ pad(total) }}</span>
            </span>
          </span>
        </div>

        <p v-if="eyebrow" class="pp-eyebrow" data-hero>{{ eyebrow }}</p>
        <h1 ref="titleEl" class="pp-title">{{ project.title }}</h1>
        <p v-if="project.subtitle" class="pp-subtitle" data-hero>{{ project.subtitle }}</p>

        <!-- Recruiter summary, visible without scrolling -->
        <dl v-if="facts.length" class="pp-facts" data-hero>
          <div v-for="f in facts" :key="f.label" class="pp-fact">
            <dt>{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>

        <div class="pp-actions" data-hero>
          <a
            v-if="project.link"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="pp-btn pp-btn--primary"
            data-cursor-label="Ouvrir"
            @mouseenter="sfx.hover($event)"
            @click="sfx.click($event)"
          >
            Voir le projet en ligne <span aria-hidden="true">↗</span>
          </a>
          <a
            v-if="project.repo"
            :href="project.repo"
            target="_blank"
            rel="noopener noreferrer"
            class="pp-btn"
            data-cursor-label="Code"
            @mouseenter="sfx.hover($event)"
            @click="sfx.click($event)"
          >
            Code source <span aria-hidden="true">↗</span>
          </a>
          <button type="button" class="pp-btn pp-btn--ghost" @mouseenter="sfx.hover($event)" @click="scrollTo(firstSectionId)">
            Détails <span aria-hidden="true">↓</span>
          </button>
        </div>
      </header>

      <!-- ================= COVER ================= -->
      <figure v-if="project.image" class="pp-cover">
        <button
          type="button"
          class="pp-cover-inner"
          data-cursor-label="Agrandir"
          :aria-label="`Agrandir l'image de couverture de ${project.title}`"
          @click="openLightbox(0)"
        >
          <img :src="project.image" :alt="`${project.title} — aperçu`" fetchpriority="high" decoding="async" />
        </button>
      </figure>

      <!-- ================= POINTS CLÉS ================= -->
      <section v-if="hasDetails" id="details" class="pp-section pp-overview" aria-labelledby="t-details">
        <div class="pp-label-col">
          <h2 id="t-details" class="pp-label" data-reveal><span>{{ sectionNo('details') }}</span> Points clés</h2>
        </div>
        <div class="pp-content-col">
          <div v-if="project.stack.length" class="pp-stack" data-reveal>
            <h3 class="pp-mini-title">Technologies</h3>
            <ul class="pp-chips">
              <li v-for="t in project.stack" :key="t" @mouseenter="sfx.hover($event)">{{ t }}</li>
            </ul>
          </div>

          <div v-if="project.highlights.length" class="pp-highlights">
            <h3 class="pp-mini-title" data-reveal>À retenir</h3>
            <ol>
              <li v-for="(h, i) in project.highlights" :key="i" class="pp-hl">
                <span class="pp-hl-n">{{ pad(i + 1) }}</span>
                <span class="pp-hl-t">{{ h }}</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- ================= STORY ================= -->
      <section v-if="project.description" id="story" class="pp-section pp-story" aria-labelledby="t-projet">
        <div class="pp-label-col">
          <h2 id="t-projet" class="pp-label pp-label--sticky" data-reveal><span>{{ sectionNo('story') }}</span> Le projet</h2>
        </div>
        <div class="pp-content-col">
          <div ref="proseEl" class="pp-prose" v-html="project.description" />
        </div>
      </section>

      <!-- ================= VIDEO ================= -->
      <section v-if="video" id="video" class="pp-section pp-video" aria-labelledby="t-video">
        <div class="pp-label-col">
          <h2 id="t-video" class="pp-label" data-reveal><span>{{ sectionNo('video') }}</span> Démo vidéo</h2>
        </div>
        <div class="pp-content-col">
          <div class="pp-video-frame" data-reveal>
            <iframe
              v-if="video.kind === 'iframe'"
              :src="video.src"
              :title="`Vidéo de présentation — ${project.title}`"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
            <video v-else :src="video.src" controls preload="metadata" playsinline />
          </div>
        </div>
      </section>

      <!-- ================= GALLERY ================= -->
      <section v-if="project.media.length" id="gallery" class="pp-section pp-gallery" aria-labelledby="t-galerie">
        <div class="pp-gallery-head">
          <h2 id="t-galerie" class="pp-label" data-reveal><span>{{ sectionNo('gallery') }}</span> Galerie</h2>
          <p class="pp-gallery-count" data-reveal>{{ project.media.length }} image{{ project.media.length > 1 ? 's' : '' }} · cliquez pour agrandir</p>
        </div>
        <div class="pp-gallery-grid">
          <button
            v-for="(src, i) in project.media"
            :key="src + i"
            type="button"
            class="pp-g"
            :class="galleryClass(i)"
            data-cursor-label="Agrandir"
            :aria-label="`Agrandir l'image ${i + 1} sur ${project.media.length}`"
            @mouseenter="sfx.hover($event)"
            @click="openLightbox(lightboxImages.indexOf(src))"
          >
            <span class="pp-g-zoom">
              <img :src="src" :alt="`${project.title} — capture ${i + 1}`" loading="lazy" decoding="async" @load="refreshTriggers" />
            </span>
            <span class="pp-g-n" aria-hidden="true">{{ pad(i + 1) }}</span>
          </button>
        </div>
      </section>

      <!-- ================= NEXT PROJECT ================= -->
      <section v-if="nav.next" class="pp-next" aria-label="Projet suivant">
        <RouterLink
          :to="{ name: 'project', params: { slug: nav.next.slug } }"
          class="pp-next-link"
          data-cursor-label="Suivant"
          @mouseenter="sfx.hover($event)"
          @click="sfx.click($event)"
        >
          <span class="pp-next-kicker">Projet suivant <span aria-hidden="true">→</span></span>
          <span class="pp-next-title">{{ nav.next.title }}</span>
          <span v-if="nav.next.subtitle" class="pp-next-sub">{{ nav.next.subtitle }}</span>
          <span v-if="nav.next.preview" class="pp-next-media" aria-hidden="true">
            <img :src="nav.next.preview" alt="" loading="lazy" />
          </span>
        </RouterLink>
        <div class="pp-next-alt">
          <RouterLink v-if="nav.prev" :to="{ name: 'project', params: { slug: nav.prev.slug } }" @mouseenter="sfx.hover($event)">
            ← {{ nav.prev.title }}
          </RouterLink>
          <RouterLink to="/projects" @mouseenter="sfx.hover($event)">Voir tous les projets</RouterLink>
        </div>
      </section>

      <!-- ================= CTA ================= -->
      <section class="pp-cta" aria-labelledby="t-cta">
        <p class="pp-cta-kicker" data-reveal>Vous recrutez ?</p>
        <h2 id="t-cta" class="pp-cta-title" data-reveal>Parlons de votre équipe.</h2>
        <div class="pp-cta-actions" data-reveal>
          <button type="button" class="pp-btn pp-btn--primary" @mouseenter="sfx.hover($event)" @click="openContact">Me contacter</button>
          <a :href="cvFile" download="CV_FERRAND-RICHARTE_Basile.pdf" class="pp-btn" @mouseenter="sfx.hover($event)" @click="sfx.click($event)">
            Télécharger mon CV <span aria-hidden="true">↓</span>
          </a>
          <RouterLink to="/about" class="pp-btn pp-btn--ghost" @mouseenter="sfx.hover($event)">À propos</RouterLink>
        </div>
      </section>
    </main>

    <!-- ================= DOCK (always reachable navigation) ================= -->
    <nav v-if="project" ref="dockEl" class="pp-dock" aria-label="Navigation entre les projets">
      <RouterLink to="/projects" class="pp-dock-btn pp-dock-index" title="Tous les projets (Échap)" @mouseenter="sfx.hover($event)">
        <span class="grid-ico" aria-hidden="true"><i /><i /><i /><i /></span>
        <span class="lbl">Index</span>
      </RouterLink>
      <span class="pp-dock-sep" aria-hidden="true" />
      <RouterLink
        v-if="nav.prev"
        :to="{ name: 'project', params: { slug: nav.prev.slug } }"
        class="pp-dock-btn"
        :aria-label="`Projet précédent : ${nav.prev.title} (flèche gauche)`"
        :title="`← ${nav.prev.title}`"
        @mouseenter="sfx.hover($event)"
      >←</RouterLink>
      <span v-if="nav.index > -1" class="pp-dock-count">{{ pad(nav.index + 1) }}<span>/{{ pad(total) }}</span></span>
      <RouterLink
        v-if="nav.next"
        :to="{ name: 'project', params: { slug: nav.next.slug } }"
        class="pp-dock-btn"
        :aria-label="`Projet suivant : ${nav.next.title} (flèche droite)`"
        :title="`${nav.next.title} →`"
        @mouseenter="sfx.hover($event)"
      >→</RouterLink>
      <span class="pp-dock-sep" aria-hidden="true" />
      <SoundToggle :show-label="false" />
    </nav>

    <Lightbox v-model="lightboxOpen" :images="lightboxImages" :start-index="lightboxIndex" :title="project?.title || ''" />
    <Footer v-if="project" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CustomCursor from '@/components/CustomCursor.vue'
import SoundToggle from '@/components/SoundToggle.vue'
import Lightbox from '@/components/Lightbox.vue'
import cvFile from '@/assets/CV_FERRAND-RICHARTE_Basile.pdf'

import { useProjectsStore } from '@/stores/useProjectsStore'
import { useModalStore } from '@/stores/useModalStore'
import { videoEmbed } from '@/data/normalizeProject'
import { useSmoothScroll, prefersReducedMotion } from '@/composables/useSmoothScroll'
import { introDelay } from '@/composables/usePageTransition'
import { sfx, ambient } from '@/composables/useSound'

gsap.registerPlugin(ScrollTrigger, SplitText)

const props = defineProps({ slug: { type: String, required: true } })

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()
const modal = useModalStore()
const { scrollTo } = useSmoothScroll()

const root = ref(null)
const titleEl = ref(null)
const proseEl = ref(null)
const progressBar = ref(null)
const dockEl = ref(null)
const project = ref(null)
const isPreview = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const reduced = prefersReducedMotion()

const pad = (n) => String(n).padStart(2, '0')
const total = computed(() => store.projects.length)
const nav = computed(() => (project.value && !isPreview.value ? store.neighbours(project.value.slug) : { index: -1, prev: null, next: null }))
const video = computed(() => videoEmbed(project.value?.video))
const eyebrow = computed(() => [project.value?.category, project.value?.year].filter(Boolean).join(' — '))
const facts = computed(() => {
  const p = project.value
  if (!p) return []
  return [
    { label: 'Rôle', value: p.role },
    { label: 'Contexte', value: p.context },
    { label: 'Année', value: p.year },
    { label: 'Stack', value: p.stack.slice(0, 4).join(', ') + (p.stack.length > 4 ? '…' : '') },
  ].filter((f) => f.value)
})
/** Gallery order is kept so "image 3" in the grid is "03" in the lightbox. */
const lightboxImages = computed(() => {
  const p = project.value
  if (!p) return []
  const list = p.media.includes(p.image) || !p.image ? p.media : [p.image, ...p.media]
  return [...new Set(list.filter(Boolean))]
})

const hasDetails = computed(() => !!(project.value?.stack.length || project.value?.highlights.length))
const sections = computed(() => {
  const p = project.value
  if (!p) return []
  return [
    hasDetails.value && 'details',
    p.description && 'story',
    video.value && 'video',
    p.media.length && 'gallery',
  ].filter(Boolean)
})
const firstSectionId = computed(() => `#${sections.value[0] || 'details'}`)

/** Section numbers adapt to which optional sections exist. */
function sectionNo(key) {
  return pad(sections.value.indexOf(key) + 1)
}

/** Editorial rhythm: every third image spans the full width. */
function galleryClass(i) {
  const count = project.value.media.length
  if (count === 1 || i % 3 === 0) return 'pp-g--wide'
  if (i === count - 1 && (i % 3) === 1) return 'pp-g--wide'
  return ''
}

function openLightbox(i) {
  if (i < 0) i = 0
  lightboxIndex.value = i
  lightboxOpen.value = true
}

function openContact(e) {
  sfx.click(e)
  modal.openContact()
}

function goTo(target, direction) {
  if (!target) return
  sfx.swipe(direction)
  router.push({ name: 'project', params: { slug: target.slug } })
}

function onKey(e) {
  if (lightboxOpen.value || modal.isContactOpen) return
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
  const el = e.target
  if (el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable)) return
  if (e.key === 'ArrowRight') { e.preventDefault(); goTo(nav.value.next, 1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(nav.value.prev, -1) }
  else if (e.key === 'Escape') router.push('/projects')
}

let refreshTimer = null
function refreshTriggers() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
}

/* ------------------------------------------------------------------ */
/* Animations                                                          */
/* ------------------------------------------------------------------ */
let ctx = null

/** Hide now, reveal when scrolled into view (no flash of content). */
function revealOnScroll(targets, from, to, start = 'top 88%') {
  gsap.utils.toArray(targets).forEach((el) => {
    gsap.set(el, from)
    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => gsap.to(el, { ...to, overwrite: 'auto' }),
    })
  })
}

function animate() {
  ctx = gsap.context(() => {
    // Reading progress bar (kept even with reduced motion: it is information).
    gsap.fromTo(progressBar.value, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    })

    if (reduced) return

    const delay = introDelay()
    const split = SplitText.create(titleEl.value, { type: 'lines,chars', mask: 'lines' })
    // Express the CSS centring as xPercent so GSAP doesn't freeze it into pixels.
    gsap.set(dockEl.value, { xPercent: -50, x: 0 })

    const tl = gsap.timeline({ delay })
    tl.from(split.chars, { yPercent: 115, rotate: 5, duration: 1.3, stagger: 0.022, ease: 'expo.out' })
      .from('[data-hero]', { y: 28, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.2)
      .from(dockEl.value, { yPercent: 160, opacity: 0, duration: 1, ease: 'expo.out' }, 0.5)

    if (root.value.querySelector('.pp-cover')) {
      tl.fromTo('.pp-cover-inner',
        { clipPath: 'inset(22% 10% 0% 10% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.8, ease: 'expo.inOut' }, 0.25)
        .from('.pp-cover img', { scale: 1.4, duration: 2.2, ease: 'expo.out' }, '<')
      gsap.fromTo('.pp-cover img', { yPercent: -7 }, {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.pp-cover', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }

    revealOnScroll('[data-reveal]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' })
    revealOnScroll('.pp-chips li', { y: 14, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 'top 95%')
    revealOnScroll('.pp-hl', { x: -30, opacity: 0, '--hl': 0 }, { x: 0, opacity: 1, '--hl': 1, duration: 1.1, ease: 'expo.out' }, 'top 90%')
    if (proseEl.value) {
      revealOnScroll(proseEl.value.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 'top 90%')
    }

    gsap.utils.toArray('.pp-g').forEach((el) => {
      const img = el.querySelector('img')
      gsap.set(el, { clipPath: 'inset(100% 0% 0% 0% round 14px)' })
      gsap.set(img, { scale: 1.3 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          gsap.to(el, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.4, ease: 'expo.inOut' })
          gsap.to(img, { scale: 1, duration: 1.8, ease: 'expo.out', delay: 0.1 })
        },
      })
    })

    if (root.value.querySelector('.pp-next')) {
      gsap.fromTo('.pp-next-title', { xPercent: 6 }, {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: '.pp-next', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }
  }, root.value)
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */
onMounted(async () => {
  await store.load()
  let p = store.projects.find((x) => x.slug === props.slug) || null
  if (!p && route.query.preview) {
    p = await store.loadPreview(props.slug)
    isPreview.value = !!p
  }
  if (!p) {
    router.replace('/projects')
    return
  }
  project.value = p
  document.title = `${p.title} — Basile Ferrand-Richarte`
  await nextTick()
  // SplitText must measure the real display font, not the fallback.
  await document.fonts?.ready
  if (!root.value) return // navigated away meanwhile
  animate()
  window.addEventListener('keydown', onKey)
  window.addEventListener('load', refreshTriggers)
  ambient.start()
})

onBeforeUnmount(() => {
  ctx?.revert()
  clearTimeout(refreshTimer)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('load', refreshTriggers)
  ambient.stop()
})
</script>

<style scoped>
/* ================================================================== */
/* Layout                                                              */
/* ================================================================== */
.pp {
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --maxw: 1440px;
  --line: rgba(255, 255, 255, 0.12);
  --text-soft: #cfcfcf;
  position: relative;
  min-height: 100vh;
  /* room for the fixed dock so it never hides the footer's last line */
  padding-bottom: 5.5rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body), sans-serif;
}

.pp-main {
  padding-bottom: 2rem;
}

.pp-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 3px;
  z-index: 70;
  pointer-events: none;
}
.pp-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), #c7c1ff);
  transform-origin: left;
  transform: scaleX(0);
}

.pp-draft {
  position: fixed;
  top: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 75;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: #ffcc66;
  color: #1a1a1a;
  font-size: 0.8rem;
  font-weight: 700;
}

/* ================================================================== */
/* Hero                                                                */
/* ================================================================== */
.pp-hero {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: clamp(8rem, 18vh, 11rem) var(--gutter) clamp(2.5rem, 6vh, 4rem);
}

.pp-hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: clamp(2rem, 6vh, 4rem);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line);
}

.pp-crumb {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}
.pp-crumb span { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.pp-crumb:hover span { transform: translateX(-6px); }

.pp-counter {
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
.pp-counter span { color: var(--color-subtitle); }

.pp-eyebrow {
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
}

.pp-title {
  font-family: var(--font-display), sans-serif;
  font-size: clamp(3rem, 10vw, 10rem);
  line-height: 0.95;
  letter-spacing: -0.015em;
  max-width: 14ch;
  overflow-wrap: anywhere;
}

.pp-subtitle {
  max-width: 40rem;
  margin-top: 1.5rem;
  font-size: clamp(1.15rem, 1.8vw, 1.6rem);
  line-height: 1.45;
  color: var(--text-soft);
}

.pp-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: clamp(1.75rem, 4vh, 2.75rem);
}

/* Buttons ---------------------------------------------------------- */
.pp-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  height: 3.1rem;
  padding: 0 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: transparent;
  color: var(--color-text);
  font: 700 0.95rem/1 var(--font-body), sans-serif;
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition: color 0.4s ease, border-color 0.4s ease;
}
.pp-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-text);
  border-radius: inherit;
  transform: translateY(101%);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-btn:hover,
.pp-btn:focus-visible { color: #0c0c0c; border-color: var(--color-text); }
.pp-btn:hover::before,
.pp-btn:focus-visible::before { transform: translateY(0); }
.pp-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

.pp-btn--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #0c0c0c;
}
.pp-btn--ghost { border-color: transparent; color: var(--color-subtitle); }

/* ================================================================== */
/* Cover                                                               */
/* ================================================================== */
.pp-cover {
  max-width: calc(var(--maxw) + 8rem);
  margin: 0 auto;
  padding: 0 clamp(0.75rem, 2vw, 2rem);
}
.pp-cover-inner {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 88vh;
  padding: 0;
  border: 0;
  overflow: hidden;
  border-radius: 18px;
  background: #1c1d1c;
}
.pp-cover-inner img {
  width: 100%;
  height: 116%;
  margin-top: -8%;
  object-fit: cover;
  display: block;
  will-change: transform;
}
.pp-cover-inner:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }

/* ================================================================== */
/* Sections                                                            */
/* ================================================================== */
.pp-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr);
  gap: clamp(1.5rem, 5vw, 6rem);
  max-width: var(--maxw);
  margin: 0 auto;
  padding: clamp(4rem, 12vh, 8rem) var(--gutter) 0;
}

.pp-label {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.5rem, 2.4vw, 2.2rem);
  line-height: 1.1;
}
.pp-label span {
  font-family: var(--font-body), sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-accent);
}
.pp-label--sticky {
  position: sticky;
  top: 6rem;
}

.pp-mini-title {
  font-family: var(--font-body), sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-subtitle);
  margin-bottom: 1rem;
}

/* Facts ------------------------------------------------------------ */
.pp-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  border-top: 1px solid var(--line);
}
.pp-fact {
  padding: 1.25rem 1.25rem 1.5rem 0;
  border-bottom: 1px solid var(--line);
}
.pp-fact dt {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-subtitle);
  margin-bottom: 0.55rem;
}
.pp-fact dd {
  margin: 0;
  font-size: 1.12rem;
  line-height: 1.4;
  font-weight: 600;
}

.pp-hero .pp-facts { margin-top: clamp(1.75rem, 4vh, 2.5rem); max-width: 1100px; }
.pp-stack { margin-top: 2.5rem; }
.pp-content-col > :first-child { margin-top: 0; }
.pp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.pp-chips li {
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.95rem;
  font-weight: 600;
  /* `translate` (not `transform`) so the hover lift never fights GSAP's reveal tween */
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, translate 0.3s ease;
}
.pp-chips li:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #0c0c0c;
  translate: 0 -2px;
}

/* Highlights ------------------------------------------------------- */
.pp-highlights { margin-top: 3rem; }
.pp-highlights ol { list-style: none; padding: 0; margin: 0; }
.pp-hl {
  --hl: 1;
  position: relative;
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 1rem;
  padding: 1.25rem 0;
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);
  line-height: 1.45;
}
.pp-hl::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  transform-origin: left;
  transform: scaleX(var(--hl));
}
.pp-hl-n {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-accent);
  padding-top: 0.3em;
  font-variant-numeric: tabular-nums;
}

/* Prose (readability first) ---------------------------------------- */
.pp-prose {
  max-width: 68ch;
  font-size: clamp(1.06rem, 1.25vw, 1.2rem);
  line-height: 1.8;
  color: var(--text-soft);
}
.pp-prose :deep(p) { margin: 0 0 1.4em; }
.pp-prose :deep(p:first-child) {
  font-size: 1.2em;
  line-height: 1.6;
  color: var(--color-text);
}
.pp-prose :deep(h2),
.pp-prose :deep(h3),
.pp-prose :deep(h4) {
  margin: 2.2em 0 0.8em;
  font-family: var(--font-display), sans-serif;
  font-size: 1.5em;
  line-height: 1.2;
  color: var(--color-text);
}
.pp-prose :deep(strong),
.pp-prose :deep(b) { color: var(--color-text); font-weight: 700; }
.pp-prose :deep(ul),
.pp-prose :deep(ol) { margin: 0 0 1.4em; padding-left: 1.25em; }
.pp-prose :deep(li) { margin-bottom: 0.7em; padding-left: 0.3em; }
.pp-prose :deep(li::marker) { color: var(--color-accent); }
.pp-prose :deep(a) {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-underline-offset: 0.2em;
  text-decoration-thickness: 2px;
}
.pp-prose :deep(a:hover) { color: var(--color-accent); }
.pp-prose :deep(blockquote) {
  margin: 2em 0;
  padding-left: 1.25em;
  border-left: 3px solid var(--color-accent);
  font-size: 1.15em;
  color: var(--color-text);
}
.pp-prose :deep(code) {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.9em;
}

/* Video ------------------------------------------------------------ */
.pp-video-frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 14px;
  background: #000;
}
.pp-video-frame iframe,
.pp-video-frame video {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* Gallery ---------------------------------------------------------- */
.pp-gallery {
  display: block;
  max-width: calc(var(--maxw) + 8rem);
}
.pp-gallery-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
}
.pp-gallery-count { font-size: 0.9rem; color: var(--color-subtitle); }
.pp-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.6vw, 1.5rem);
}
.pp-g {
  position: relative;
  display: block;
  padding: 0;
  border: 0;
  overflow: hidden;
  border-radius: 14px;
  background: #1c1d1c;
  aspect-ratio: 4 / 3;
}
.pp-g--wide {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 8;
}
.pp-g-zoom {
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-g:hover .pp-g-zoom { transform: scale(1.04); }
.pp-g img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}
.pp-g:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }
.pp-g-n {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(12, 12, 12, 0.7);
  backdrop-filter: blur(6px);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.4s ease;
}
.pp-g:hover .pp-g-n,
.pp-g:focus-visible .pp-g-n { opacity: 1; transform: none; }

/* ================================================================== */
/* Next project                                                        */
/* ================================================================== */
.pp-next {
  max-width: var(--maxw);
  margin: clamp(6rem, 16vh, 11rem) auto 0;
  padding: 0 var(--gutter);
  overflow: hidden;
}
.pp-next-link {
  position: relative;
  display: grid;
  gap: 0.75rem;
  padding: clamp(2.5rem, 6vh, 4rem) 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  color: var(--color-text);
  text-decoration: none;
  isolation: isolate;
}
.pp-next-kicker {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.pp-next-title {
  font-family: var(--font-display), sans-serif;
  font-size: clamp(3rem, 11vw, 11rem);
  line-height: 0.95;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px rgba(249, 249, 249, 0.6);
  background: linear-gradient(90deg, var(--color-text) 50%, transparent 50%) no-repeat;
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  transition: background-position 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-next-link:hover .pp-next-title,
.pp-next-link:focus-visible .pp-next-title { background-position: 0 0; }
.pp-next-link:focus-visible { outline: none; }
.pp-next-link:focus-visible .pp-next-kicker { text-decoration: underline; }
.pp-next-sub { font-size: 1.05rem; color: var(--color-subtitle); }
.pp-next-media {
  position: absolute;
  right: 0;
  top: 50%;
  z-index: -1;
  width: clamp(220px, 26vw, 420px);
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 14px;
  transform: translateY(-50%) rotate(3deg);
  clip-path: inset(50% 50% 50% 50% round 14px);
  transition: clip-path 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-next-media img { width: 100%; height: 100%; object-fit: cover; }
.pp-next-link:hover .pp-next-media {
  clip-path: inset(0% 0% 0% 0% round 14px);
  transform: translateY(-50%) rotate(-2deg);
}
.pp-next-alt {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 0;
  font-size: 0.95rem;
}
.pp-next-alt a { color: var(--color-subtitle); }
.pp-next-alt a:hover { color: var(--color-text); }

/* ================================================================== */
/* CTA                                                                 */
/* ================================================================== */
.pp-cta {
  max-width: var(--maxw);
  margin: clamp(5rem, 14vh, 9rem) auto clamp(6rem, 14vh, 9rem);
  padding: 0 var(--gutter);
  text-align: center;
}
.pp-cta-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.pp-cta-title {
  margin: 1rem 0 2.25rem;
  font-family: var(--font-display), sans-serif;
  font-size: clamp(2.2rem, 6vw, 5rem);
  line-height: 1.05;
}
.pp-cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

/* ================================================================== */
/* Dock                                                                */
/* ================================================================== */
.pp-dock {
  position: fixed;
  left: 50%;
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(19, 20, 19, 0.72);
  backdrop-filter: blur(16px) saturate(140%);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
}
.pp-dock-btn {
  display: inline-grid;
  grid-auto-flow: column;
  place-items: center;
  gap: 0.5rem;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.7rem;
  border-radius: 999px;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.25s ease, color 0.25s ease;
}
.pp-dock-btn:hover,
.pp-dock-btn:focus-visible {
  background: var(--color-text);
  color: #0c0c0c;
  outline: none;
}
.pp-dock-index .lbl {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.grid-ico {
  display: grid;
  grid-template-columns: repeat(2, 5px);
  gap: 2px;
}
.grid-ico i { width: 5px; height: 5px; border-radius: 1px; background: currentColor; }
.pp-dock-count {
  min-width: 3.6rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.pp-dock-count span { color: var(--color-subtitle); font-weight: 400; }
.pp-dock-sep { width: 1px; height: 1.4rem; background: rgba(255, 255, 255, 0.14); }
.pp-dock :deep(.sound-toggle) { border-color: transparent; background: transparent; height: 2.5rem; }

.pp-hero-meta { display: inline-flex; align-items: center; gap: 1.5rem; }
.pp-kbd {
  font-size: 0.75rem;
  color: var(--color-subtitle);
}
.pp-kbd kbd {
  display: inline-block;
  min-width: 1.6rem;
  margin-right: 0.2rem;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font: inherit;
  text-align: center;
  color: var(--color-text);
}

/* ================================================================== */
/* Responsive                                                          */
/* ================================================================== */
@media (max-width: 1100px) {
  .pp-kbd { display: none; }
}

@media (max-width: 900px) {
  .pp-section { grid-template-columns: 1fr; gap: 1.5rem; }
  .pp-label--sticky { position: static; }
  .pp-next-media { display: none; }
}

@media (max-width: 640px) {
  .pp-gallery-grid { grid-template-columns: 1fr; }
  .pp-g--wide { aspect-ratio: 4 / 3; }
  .pp-cover-inner { aspect-ratio: 4 / 3; border-radius: 12px; }
  .pp-next-title { white-space: normal; font-size: clamp(2.6rem, 13vw, 4rem); }
  .pp-dock-index .lbl { display: none; }
  .pp-actions .pp-btn { flex: 1 1 auto; justify-content: center; }
  .pp-g-n { opacity: 1; transform: none; }
}

@media (hover: none) {
  .pp-next-title { color: var(--color-text); -webkit-text-stroke: 0; background: none; }
}
</style>
