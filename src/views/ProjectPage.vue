<template>
  <div class="banner">
    <!-- Hero banner -->
    <header class="hero-banner" v-if="project">
      <img :src="project.image" :alt="project.title"/>
    </header>
  </div>
  <div class="project-page">
    <Header :show-logo="true"/>
    <button class="back" @click="goBack">← Retour</button>



    <section class="breadcrumb">
      <Breadcrumb v-if="project" :current="project.title"/>
    </section>


    <main class="container" v-if="project">
      <h1 class="title">{{ project.title }}</h1>
      <h2 v-if="project.subtitle" class="subtitle">{{ project.subtitle }}</h2>

      <div class="description" v-html="project.description"></div>

      <!-- Galerie média -->
      <div class="media" v-if="project.media">
        <img
            v-for="(img, i) in project.media"
            :key="i"
            :src="img"
            :alt="project.title + ' image ' + (i + 1)"
            @click="openModal(i)"
            class="clickable"
        />
      </div>
      <ImageModal
          v-if="modalVisible"
          v-model="modalVisible"
          :images="project.media"
          :startIndex="modalIndex"
      />


      <!-- Lecteur vidéo -->
      <div v-if="project.video" class="video-container mb-6">
        <iframe
            :src="project.video"
            title="Vidéo de présentation"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-64 md:h-96 rounded-lg shadow-lg"
        ></iframe>
      </div>


      <!-- Bouton vers le projet en ligne -->
      <div class="flex justify-center mt-8">
        <animated-button v-if="project.link"
                         class="external-link"
                         @click="openExternal(project.link)"
        >
          Voir en ligne
        </animated-button>
      </div>

      <!-- CTA Final -->
      <section class="cta-final">
        <h3 class="cta-title split-text">Prêt à discuter ?</h3>
        <p class="cta-subtitle"><button @click="modal.openContact()" class="cta-contact-btn"><strong>ME CONTACTER </strong></button>
          ou apprenez en davantage</p>
        <RouterLink to="/about">
          <animated-button>
            À PROPOS
          </animated-button>
        </RouterLink>
        <RouterLink to="/" class="retour-proj">
          <div class="retour-row">
            <h4 class="projects">Autres Projets</h4>
          </div>
        </RouterLink>
      </section>


    </main>
    <Footer/>
  </div>
</template>

<script setup>
import {defineProps, ref, onMounted, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import projects from '@/data/projects.js';
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import AnimatedButton from "@/components/AnimatedButton.vue";
import ImageModal from "@/components/ImageModal.vue";

import { useModalStore } from '@/stores/useModalStore'

const modal = useModalStore()

const modalVisible = ref(false);
const modalIndex = ref(0);

const props = defineProps({
  slug: String
})

function openModal(i) {
  modalIndex.value = i;
  modalVisible.value = true;
}

const route = useRoute();
const router = useRouter();
const slug = route.params.slug;
const project = ref(null);

function openExternal(url) {
  if (!url) return;
  window.open(url, "_blank");
}


onMounted(() => {
  project.value = projects.find(p => p.slug === slug) || null;
  if (!project.value) {
    router.replace('/'); // projet introuvable -> accueil
  } else {
    window.scrollTo(0, 0);
  }
  // scroll autorisé
  document.documentElement.style.overflowY = 'auto';
  document.body.style.overflowY = 'auto';

  // forcer #app à hauteur auto pour scroll
  const app = document.getElementById('app');
  if (app) app.style.height = 'auto';

  window.scrollTo(0, 0);
});

onUnmounted(() => {
  document.documentElement.style.overflowY = 'hidden';
  document.body.style.overflowY = 'hidden';
  const app = document.getElementById('app');
  if (app) app.style.height = '100%';
})

function goBack() {
  router.back();
}
</script>

<style scoped>

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

.project-page {
  width: 100vw;
  min-height: auto;
  background: var(--color-bg);
  color: var(--color-text);
}

/* Bouton retour */
.back {
  position: fixed;
  top: 6rem;
  left: 1rem;
  z-index: 50;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-subtitle);
  color: var(--color-subtitle);
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.back:hover {
  background: var(--color-accent);
  color: #000;
}

/* Hero banner */
.hero-banner img {
  width: 100%;
  height: 50vh;
  object-fit: cover;
  display: block;
}

/* Contenu principal */
.container {
  max-width: 1000px;
  margin: 1rem auto;
  padding: 0 2rem;
}

.title {
  font-size: 2.5rem;
  margin: 1rem 0;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-subtitle);
}

.description {
  color: #ddd;
  line-height: 1.8;
  margin-bottom: 2rem;
}

/* Galerie média */
.media {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.media img {
  width: 100%;
  border-radius: 12px;
  transition: ease-in-out 0.2s;
}

.media img:hover {
  transform: scale(1.02);
}

/* Bouton externe */
.external-link {
  margin-top: 2rem;
  border-radius: 999px; /* capsule compatible avec le SVG */
  position: relative;
  cursor: pointer;
  overflow: hidden;
  justify-content: center;

}

.external-link:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-banner img {
    height: 35vh;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .description {
    font-size: 0.95rem;
  }

  .media {
    grid-template-columns: 1fr;
  }
}
.video-container iframe {
  width: 100%;
  height: 40rem;
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

</style>
