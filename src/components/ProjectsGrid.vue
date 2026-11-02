<template>
  <div class="projects-grid">
    <div
        v-for="project in projects"
        :key="project.slug || project.title"
        class="project-card"
        @click="openLink(project)"
        ref="cards"
    >
      <img :src="project.preview" :alt="project.title" />
      <h3>{{ project.title }}</h3>
    </div>
    <RouterLink to="/projects" class="project-card project-card--all">
      <span>Tous les projets →</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/useProjectsStore'

const router = useRouter()
const store = useProjectsStore()
const projects = computed(() => store.projects)

const cards = ref([])

const openLink = (project) => {
  if (project.slug) {
    router.push({ name: 'project', params: { slug: project.slug } })
  } else if (project.link) {
    window.open(project.link, '_blank')
  }
}

onMounted(async () => {
  await store.load()
  await nextTick()
  gsap.from(cards.value, {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'bounce.out',
    duration: 0.8,
  })
})
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 0 auto;
  z-index: 2;
}

.project-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.project-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
}

.project-card h3 {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-accent);
}

.project-card--all {
  display: grid;
  place-items: center;
  color: var(--color-text);
  font-weight: 700;
  border-color: var(--color-accent);
}

.project-card:active {
  transform: scale(0.95);
}
</style>
