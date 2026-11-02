<template>
  <div ref="root" class="pi">
    <CustomCursor />
    <Header :show-logo="true" />

    <main class="pi-main" id="contenu">
      <!-- ============ HERO ============ -->
      <header class="pi-hero">
        <p class="pi-eyebrow" data-intro>
          <span class="dot" aria-hidden="true" /> Index des travaux — {{ year }}
        </p>
        <h1 class="pi-title">
          <span ref="titleEl" class="pi-title-word">Projets</span>
          <sup class="pi-count" data-intro>({{ pad(store.projects.length) }})</sup>
        </h1>
        <p class="pi-lead" data-intro>
          Développement web, expériences 3D et design d'interface.
          Chaque fiche résume en un coup d'œil <strong>le contexte, mon rôle et la stack</strong>.
        </p>
      </header>

      <!-- ============ TOOLBAR ============ -->
      <div class="pi-toolbar" data-intro>
        <div class="pi-filters" role="group" aria-label="Filtrer par catégorie">
          <button
            v-for="f in filters"
            :key="f.value"
            type="button"
            class="pi-filter"
            :class="{ active: filter === f.value }"
            :aria-pressed="filter === f.value"
            @click="setFilter(f.value, $event)"
            @mouseenter="sfx.hover($event)"
          >
            {{ f.label }} <span class="n">{{ f.count }}</span>
          </button>
        </div>

        <div class="pi-tools">
          <div v-if="!isMobile" class="pi-view" role="group" aria-label="Affichage">
            <button type="button" :class="{ active: view === 'list' }" :aria-pressed="view === 'list'" @click="setView('list', $event)">Liste</button>
            <button type="button" :class="{ active: view === 'grid' }" :aria-pressed="view === 'grid'" @click="setView('grid', $event)">Grille</button>
          </div>
          <SoundToggle />
        </div>
      </div>

      <!-- ============ LIST VIEW ============ -->
      <ol
        v-if="effectiveView === 'list'"
        ref="listEl"
        class="pi-list"
        @mouseleave="hidePreview"
      >
        <li class="pi-list-head" aria-hidden="true">
          <span>N°</span><span>Projet</span><span>Catégorie</span><span>Stack</span><span>Année</span>
        </li>
        <li v-for="p in filtered" :key="p.slug" class="pi-row" data-row>
          <RouterLink
            :to="{ name: 'project', params: { slug: p.slug } }"
            class="pi-row-link"
            data-cursor-label="Voir"
            @mouseenter="showPreview(p, $event)"
            @focus="showPreview(p)"
            @blur="hidePreview"
            @click="sfx.click($event)"
          >
            <span class="pi-row-index">{{ pad(indexOf(p) + 1) }}</span>
            <span class="pi-row-main">
              <span class="pi-row-title">{{ p.title }}</span>
              <span class="pi-row-sub">{{ p.subtitle }}</span>
            </span>
            <span class="pi-row-cat">{{ p.category }}</span>
            <span class="pi-row-stack">{{ p.stack.slice(0, 3).join(' · ') }}</span>
            <span class="pi-row-year">{{ p.year }}</span>
            <span class="pi-row-arrow" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ol>

      <!-- ============ GRID VIEW ============ -->
      <ul v-else ref="gridEl" class="pi-grid">
        <li v-for="p in filtered" :key="p.slug" class="pi-card" data-row>
          <RouterLink
            :to="{ name: 'project', params: { slug: p.slug } }"
            class="pi-card-link"
            data-cursor-label="Voir"
            @mouseenter="sfx.hover($event)"
            @click="sfx.click($event)"
          >
            <div class="pi-card-media">
              <img v-if="p.preview" :src="p.preview" :alt="`Aperçu du projet ${p.title}`" loading="lazy" decoding="async" />
              <span class="pi-card-index">{{ pad(indexOf(p) + 1) }}</span>
            </div>
            <div class="pi-card-body">
              <h2 class="pi-card-title">{{ p.title }}</h2>
              <p class="pi-card-sub">{{ p.subtitle }}</p>
              <p class="pi-card-meta">
                <span>{{ p.category }}</span><span v-if="p.year">{{ p.year }}</span>
              </p>
              <ul class="pi-card-stack" aria-label="Technologies">
                <li v-for="t in p.stack.slice(0, 4)" :key="t">{{ t }}</li>
              </ul>
            </div>
          </RouterLink>
        </li>
      </ul>

      <p v-if="store.loaded && !filtered.length" class="pi-empty">Aucun projet dans cette catégorie pour l'instant.</p>

      <!-- Floating preview that follows the cursor on the list view -->
      <div v-if="effectiveView === 'list'" ref="floatEl" class="pi-float" aria-hidden="true">
        <div class="pi-float-inner">
          <img
            v-for="p in store.projects"
            :key="p.slug"
            :src="p.preview"
            alt=""
            :class="{ on: hovered === p.slug }"
            loading="lazy"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CustomCursor from '@/components/CustomCursor.vue'
import SoundToggle from '@/components/SoundToggle.vue'
import { useProjectsStore } from '@/stores/useProjectsStore'
import { useSmoothScroll, prefersReducedMotion } from '@/composables/useSmoothScroll'
import { introDelay } from '@/composables/usePageTransition'
import { sfx, ambient } from '@/composables/useSound'

gsap.registerPlugin(SplitText)

const store = useProjectsStore()
useSmoothScroll()

const VIEW_KEY = 'kosmo:projects-view'
const root = ref(null)
const titleEl = ref(null)
const listEl = ref(null)
const gridEl = ref(null)
const floatEl = ref(null)
const filter = ref('all')
const hovered = ref(null)
const isMobile = ref(window.innerWidth <= 768)
const view = ref((() => { try { return localStorage.getItem(VIEW_KEY) || 'list' } catch { return 'list' } })())
const year = new Date().getFullYear()
const reduced = prefersReducedMotion()

const pad = (n) => String(n).padStart(2, '0')
const indexOf = (p) => store.projects.indexOf(p)
const effectiveView = computed(() => (isMobile.value ? 'grid' : view.value))

const filters = computed(() => [
  { value: 'all', label: 'Tous', count: store.projects.length },
  ...store.categories.map((c) => ({ value: c, label: c, count: store.projects.filter((p) => p.category === c).length })),
])
const filtered = computed(() => (filter.value === 'all' ? store.projects : store.projects.filter((p) => p.category === filter.value)))

let ctx = null
let floatX = null
let floatY = null
let lastX = 0
let skew = null

function animateRows() {
  if (reduced) return
  const rows = root.value?.querySelectorAll('[data-row]')
  if (!rows?.length) return
  gsap.fromTo(rows, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out', overwrite: true })
}

async function setFilter(value, e) {
  if (filter.value === value) return
  sfx.tick(e)
  filter.value = value
  await nextTick()
  animateRows()
}

async function setView(value, e) {
  if (view.value === value) return
  sfx.tick(e)
  view.value = value
  try { localStorage.setItem(VIEW_KEY, value) } catch { /* ignore */ }
  await nextTick()
  setupFloat()
  animateRows()
}

/* ---------- floating preview ---------- */
function setupFloat() {
  if (!floatEl.value || reduced) return
  floatX = gsap.quickTo(floatEl.value, 'x', { duration: 0.65, ease: 'power3' })
  floatY = gsap.quickTo(floatEl.value, 'y', { duration: 0.65, ease: 'power3' })
  skew = gsap.quickTo(floatEl.value, 'rotation', { duration: 0.8, ease: 'power3' })
}

function onPointerMove(e) {
  if (!floatX) return
  floatX(e.clientX)
  floatY(e.clientY)
  const v = Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.4))
  skew(v)
  lastX = e.clientX
}

function showPreview(p, e) {
  if (e) sfx.hover(e)
  hovered.value = p.slug
  if (!floatEl.value) return
  if (!e) {
    // keyboard focus: park the preview next to the focused row
    const rect = root.value.querySelector('.pi-row-link:focus')?.getBoundingClientRect()
    if (rect && floatX) { floatX(rect.left + rect.width * 0.45); floatY(rect.top + rect.height / 2) }
  }
  gsap.to(floatEl.value, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
}

function hidePreview() {
  hovered.value = null
  if (!floatEl.value) return
  gsap.to(floatEl.value, { opacity: 0, scale: 0.85, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
}

/* ---------- intro ---------- */
function intro() {
  ctx = gsap.context(() => {
    if (reduced) return
    const split = SplitText.create(titleEl.value, { type: 'chars', mask: 'chars' })
    const tl = gsap.timeline({ delay: introDelay() })
    tl.from(split.chars, { yPercent: 115, rotate: 8, duration: 1.2, stagger: 0.045, ease: 'expo.out' })
      .from('[data-intro]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.9')
      .from('.pi-list-head, [data-row]', { y: 40, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, '-=0.7')
  }, root.value)
}

const onResize = () => { isMobile.value = window.innerWidth <= 768 }

watch(effectiveView, async () => { await nextTick(); setupFloat() })

onMounted(async () => {
  await store.load()
  await nextTick()
  await document.fonts?.ready
  if (!root.value) return
  intro()
  setupFloat()
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('resize', onResize)
  ambient.start()
})

onBeforeUnmount(() => {
  ctx?.revert()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('resize', onResize)
  ambient.stop()
})
</script>

<style scoped>
.pi {
  --gutter: clamp(1.25rem, 4vw, 4rem);
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body), sans-serif;
}

.pi-main {
  position: relative;
  padding: clamp(8rem, 16vh, 11rem) var(--gutter) 6rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* ---------- hero ---------- */
.pi-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-subtitle);
}
.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 0 rgba(137, 126, 255, 0.6);
  animation: ping 2.4s ease-out infinite;
}
@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(137, 126, 255, 0.55); }
  70%, 100% { box-shadow: 0 0 0 10px rgba(137, 126, 255, 0); }
}

.pi-title {
  display: flex;
  align-items: flex-start;
  gap: 0.15em;
  margin: 0.75rem 0 1.5rem;
  font-family: var(--font-display), sans-serif;
  font-size: clamp(4rem, 12vw, 11rem);
  line-height: 0.88;
  letter-spacing: -0.02em;
}
.pi-count {
  font-family: var(--font-body), sans-serif;
  font-size: clamp(1rem, 2vw, 1.6rem);
  font-weight: 600;
  color: var(--color-accent);
  top: 0;
  margin-top: 0.4em;
}
.pi-lead {
  max-width: 38rem;
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.65;
  color: #c9c9c9;
}
.pi-lead strong { color: var(--color-text); font-weight: 700; }

/* ---------- toolbar ---------- */
.pi-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: clamp(2.5rem, 6vh, 4.5rem) calc(var(--gutter) * -1) 0;
  padding: 1rem var(--gutter);
  background: linear-gradient(to bottom, var(--color-bg) 70%, rgba(19, 20, 19, 0));
}
.pi-filters,
.pi-tools,
.pi-view {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.pi-filter,
.pi-view button {
  height: 2.5rem;
  padding: 0 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: var(--color-text);
  font: 600 0.85rem/1 var(--font-body), sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.pi-filter .n {
  margin-left: 0.3rem;
  font-size: 0.7rem;
  color: var(--color-subtitle);
  font-variant-numeric: tabular-nums;
}
.pi-filter:hover,
.pi-view button:hover { border-color: var(--color-accent); }
.pi-filter.active,
.pi-view button.active {
  background: var(--color-text);
  color: #0c0c0c;
  border-color: var(--color-text);
}
.pi-filter.active .n { color: #555; }
.pi-filter:focus-visible,
.pi-view button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
.pi-view { padding-right: 0.5rem; margin-right: 0.25rem; border-right: 1px solid rgba(255, 255, 255, 0.1); }

/* ---------- list ---------- */
.pi-list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}
.pi-list-head,
.pi-row-link {
  display: grid;
  grid-template-columns: 4rem minmax(0, 2.2fr) minmax(0, 1fr) minmax(0, 1.3fr) 4rem 2rem;
  align-items: center;
  gap: 1.5rem;
}
.pi-list-head {
  padding: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-subtitle);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.pi-list-head span:nth-child(2) { grid-column: 2; }

.pi-row { border-bottom: 1px solid rgba(255, 255, 255, 0.12); }
.pi-row-link {
  position: relative;
  isolation: isolate;
  padding: clamp(1.4rem, 3vh, 2.2rem) 0;
  color: var(--color-text);
  text-decoration: none;
  transition: opacity 0.45s ease;
}
.pi-row-link::before {
  content: '';
  position: absolute;
  inset: 0 calc(var(--gutter) * -0.5);
  background: linear-gradient(90deg, rgba(137, 126, 255, 0.12), rgba(137, 126, 255, 0));
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
}
.pi-row-link:hover::before,
.pi-row-link:focus-visible::before { transform: scaleY(1); }
.pi-list:hover .pi-row-link:not(:hover) { opacity: 0.38; }
.pi-row-link:focus-visible { outline: none; }

.pi-row-index {
  font-size: 0.85rem;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
}
.pi-row-main {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}
.pi-row-title {
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.6rem, 3.2vw, 3.2rem);
  line-height: 1;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
}
.pi-row-sub {
  font-size: 0.95rem;
  color: var(--color-subtitle);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.03s;
}
.pi-row-link:hover .pi-row-title,
.pi-row-link:focus-visible .pi-row-title { transform: translateX(1.2rem); color: var(--color-accent); }
.pi-row-link:hover .pi-row-sub,
.pi-row-link:focus-visible .pi-row-sub { transform: translateX(1.2rem); }
.pi-row-cat,
.pi-row-stack { font-size: 0.92rem; color: #c4c4c4; }
.pi-row-year { font-size: 0.92rem; font-variant-numeric: tabular-nums; color: var(--color-subtitle); }
.pi-row-arrow {
  font-size: 1.3rem;
  color: var(--color-accent);
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.3s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.pi-row-link:hover .pi-row-arrow,
.pi-row-link:focus-visible .pi-row-arrow { opacity: 1; transform: translateX(0); }

/* floating preview */
.pi-float {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: clamp(240px, 22vw, 380px);
  aspect-ratio: 4 / 3;
  /* sits to the right of the cursor so the hovered title stays readable */
  margin: calc(clamp(240px, 22vw, 380px) * -0.375) 0 0 2.5rem;
  transform-origin: left center;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.85);
}
.pi-float-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 14px;
  background: #1d1e1d;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
}
.pi-float img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.15);
  clip-path: inset(100% 0 0 0);
  transition: opacity 0.4s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), clip-path 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.pi-float img.on {
  opacity: 1;
  transform: scale(1);
  clip-path: inset(0 0 0 0);
}

/* ---------- grid ---------- */
.pi-grid {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: clamp(1.25rem, 2.5vw, 2.5rem);
}
.pi-card-link {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  color: var(--color-text);
  text-decoration: none;
}
.pi-card-media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 14px;
  background: #1d1e1d;
}
.pi-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease;
}
.pi-card-link:hover .pi-card-media img,
.pi-card-link:focus-visible .pi-card-media img { transform: scale(1.06); }
.pi-card-link:focus-visible { outline: none; }
.pi-card-link:focus-visible .pi-card-media { outline: 2px solid var(--color-accent); outline-offset: 4px; }
.pi-card-index {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: rgba(12, 12, 12, 0.7);
  backdrop-filter: blur(6px);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}
.pi-card-title {
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  line-height: 1.1;
  transition: color 0.3s ease;
}
.pi-card-link:hover .pi-card-title { color: var(--color-accent); }
.pi-card-sub { margin-top: 0.3rem; color: #c4c4c4; font-size: 0.98rem; line-height: 1.5; }
.pi-card-meta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.6rem;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-subtitle);
}
.pi-card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.8rem 0 0;
  padding: 0;
  list-style: none;
}
.pi-card-stack li {
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 0.78rem;
  color: #d8d8d8;
}

.pi-empty { margin-top: 3rem; color: var(--color-subtitle); }

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .pi-list-head,
  .pi-row-link { grid-template-columns: 3rem minmax(0, 2fr) minmax(0, 1fr) 3.5rem 1.5rem; }
  .pi-row-stack,
  .pi-list-head span:nth-child(4) { display: none; }
}
@media (max-width: 768px) {
  .pi-toolbar { position: static; }
  .pi-filters { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 calc(var(--gutter) * -1); padding: 0 var(--gutter); }
  .pi-filter { flex: 0 0 auto; }
}
@media (prefers-reduced-motion: reduce) {
  .dot { animation: none; }
}
</style>
