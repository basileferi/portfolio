<template>
  <div class="legal-wrapper">
    <Header />

    <section class="breadcrumb">
      <Breadcrumb :current="t('legal.title')" />
    </section>

    <main class="legal-page">
      <h1 class="legal-main-title">{{ t('legal.title') }}</h1>

      <!-- Publisher -->
      <section class="legal-section">
        <h2 class="legal-subtitle">{{ t('legal.publisher.title') }}</h2>
        <p v-html="t('legal.publisher.text')" />
        <p>
          <strong>{{ t('legal.publisher.contact') }}</strong> {{ MailToCopy }} <button type="button" @click="copyToClipboard" class="btn-inner" :title="t('common.copyEmail')" :aria-label="t('common.copyEmail')"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g id="copy_line" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F9F9F9FF' d='M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z'/></g></svg>
        </button>
        </p>
      </section>

      <!-- Hosting -->
      <section class="legal-section">
        <h2 class="legal-subtitle">{{ t('legal.hosting.title') }}</h2>
        <p>
          {{ t('legal.hosting.text') }} <a href="https://www.infomaniak.com"><strong>Infomaniak Network SA</strong></a>.
        </p>
        <p>{{ t('legal.hosting.address') }}</p>
      </section>

      <!-- Personal data / GDPR -->
      <section class="legal-section">
        <h2 class="legal-subtitle">{{ t('legal.data.title') }}</h2>

        <h3 class="legal-subheading">{{ t('legal.data.collectionTitle') }}</h3>
        <p v-html="t('legal.data.collection')" />

        <h3 class="legal-subheading">{{ t('legal.data.rightsTitle') }}</h3>
        <p>
          {{ t('legal.data.rights') }} {{ MailToCopy }} <button type="button" @click="copyToClipboard" class="btn-inner" :title="t('common.copyEmail')" :aria-label="t('common.copyEmail')"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g id="copy_line" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F9F9F9FF' d='M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z'/></g></svg>
        </button>
        </p>

        <h3 class="legal-subheading">{{ t('legal.data.cookiesTitle') }}</h3>
        <p>{{ t('legal.data.cookies') }}</p>

        <h3 class="legal-subheading">{{ t('legal.data.retentionTitle') }}</h3>
        <p>{{ t('legal.data.retention') }}</p>
      </section>

      <!-- Intellectual property -->
      <section class="legal-section">
        <h2 class="legal-subtitle">{{ t('legal.ip.title') }}</h2>
        <p v-html="t('legal.ip.p1')" />
        <p>{{ t('legal.ip.p2') }}</p>
        <p>{{ t('legal.ip.p3') }}</p>
      </section>

      <!-- Limitation of liability -->
      <section class="legal-section">
        <h2 class="legal-subtitle">{{ t('legal.liability.title') }}</h2>

        <h3 class="legal-subheading">{{ t('legal.liability.contentTitle') }}</h3>
        <p>{{ t('legal.liability.content') }}</p>

        <h3 class="legal-subheading">{{ t('legal.liability.linksTitle') }}</h3>
        <p>{{ t('legal.liability.links') }}</p>

        <h3 class="legal-subheading">{{ t('legal.liability.availabilityTitle') }}</h3>
        <p>{{ t('legal.liability.availability') }}</p>
      </section>

      <!-- Credits -->
      <section class="legal-section">
        <h2 class="legal-subtitle">{{ t('legal.credits.title') }}</h2>
        <p>
          <strong>{{ t('legal.credits.design') }}</strong> Basile Ferrand-Richarte
        </p>
        <p>
          <strong>{{ t('legal.credits.tech') }}</strong> Vue.js, Vite, HTML, CSS, JavaScript, Tailwind CSS, GSAP, Three.js, Pinia, PHP, MariaDB, Formspree
        </p>
        <p>
          <strong>{{ t('legal.credits.icons') }}</strong> <a class="link" href="https://www.mingcute.com/">Mingcute</a>
        </p>
      </section>

    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useSmoothScroll } from "@/composables/useSmoothScroll";
import { t } from '@/i18n';

useSmoothScroll({ wrapper: ".legal-wrapper" });

const MailToCopy = "basileferi.pro@proton.me";

function copyToClipboard() {
  navigator.clipboard.writeText(MailToCopy)
      .then(() => {
        alert(t('common.emailCopied', { email: MailToCopy }));
      })
      .catch(console.error);
}
</script>

<style scoped>

.breadcrumb {
  padding-top: 1rem;
}

.btn-inner {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.98em 1rem; /* définit la zone cliquable */
  color: var(--color-text);
  border: none;
  transition: transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; /* espace entre l’icône et le texte */
}


.btn-inner:hover {
  transform: scale(0.95);
  color: var(--color-subtitle);
}
/* ===================================
   WRAPPER GÉNÉRAL
   =================================== */
.legal-wrapper {
  padding-top: 5rem;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

/* ===================================
   CONTENEUR PRINCIPAL
   =================================== */
.legal-page {
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--color-text);
}

/* ===================================
   TITRE PRINCIPAL
   =================================== */
.legal-main-title {
  font-family: var(--font-display), sans-serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--color-text);
  margin: 0 0 3rem 0;
  letter-spacing: -0.02em;
}

/* ===================================
   SECTIONS
   =================================== */
.legal-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.legal-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Titres de section (h2) */
.legal-subtitle {
  font-family: var(--font-display), sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-subtitle);
  margin: 0 0 1rem 0;
}

/* Sous-titres (h3) */
.legal-subheading {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 1.5rem 0 0.75rem 0;
  opacity: 0.95;
}

/* Paragraphes */
.legal-section p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.legal-section p:last-child {
  margin-bottom: 0;
}

/* Texte en gras */
.legal-section strong {
  font-weight: 500;
  color: var(--color-text);
  opacity: 1;
}

/* ===================================
   LIENS INTERNES
   =================================== */
.legal-link {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.3);
  text-underline-offset: 2px;
  transition: all 0.2s ease;
}

.legal-link:hover {
  color: var(--color-accent);
  text-decoration-color: var(--color-accent);
}

/* ===================================
   RESPONSIVE (<768px)
   =================================== */
@media (max-width: 768px) {
  .legal-page {
    padding: 3rem 1.5rem;
  }

  .legal-main-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .legal-subtitle {
    font-size: 1rem;
  }

  .legal-section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  .legal-section p {
    font-size: 0.9rem;
  }
}

/* ===================================
   TRÈS PETITS ÉCRANS (<480px)
   =================================== */
@media (max-width: 480px) {
  .legal-page {
    padding: 2.5rem 1.25rem;
  }

  .legal-main-title {
    font-size: 1.75rem;
  }
}
</style>