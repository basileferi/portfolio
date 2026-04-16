<template>
  <footer class="footer-wrapper">
    <!-- Ligne de séparation -->
    <div class="footer-separator"></div>

    <!-- Niveau 1 : Contenu principal (3 colonnes) -->
    <div class="footer-main">
      <!-- Colonne gauche : Logo -->
      <RouterLink to="/" class="footer-logo">
        <img src="@/assets/logo/logo_b.png" alt="Logo Basile Feri" class="logo-image">
      </RouterLink>

      <!-- Colonne centre : Menu -->
      <nav class="footer-menu" aria-label="Navigation footer">
        <h3 class="footer-title">Menu</h3>
        <ul class="menu-list">
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/about">À propos</router-link></li>
          <li>
            <button @click="modal.openContact()" class="footer-contact-btn"><strong>Me contacter</strong></button>
          </li>
        </ul>
        <!-- Lien CV -->
        <a :href="cvFile" download="CV_FERRAND-RICHARTE_Basile.pdf" class="cv-link">
          CV
        <svg class="icon-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0 0l-4-4m4 4l4-4"/>
        </svg>
        </a>
      </nav>

      <!-- Colonne droite : Socials -->
      <nav class="footer-socials" aria-label="Réseaux sociaux">
        <h3 class="footer-title">Réseaux</h3>
        <div class="socials-list">
          <a
              href="https://linkedin.com/in/basileferi"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="LinkedIn">
            <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg"
                alt=""
                class="social-icon">
            <span>LinkedIn</span>
          </a>
          <a
              href="https://github.com/basileferi"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="GitHub">
            <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"
                alt=""
                class="social-icon">
            <span>GitHub</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- Niveau 2 : Ligne inférieure -->
    <div class="footer-bottom">
      <p class="footer-copyright">© {{ currentYear }} Basile Ferrand-Richarte</p>
      <p class="footer-brand">Kosmo.</p>
      <router-link to="/mentions-legales" class="footer-legal">Mentions légales</router-link>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import AnimatedButton from "@/components/AnimatedButton.vue";
import cvFile from '@/assets/CV_FERRAND-RICHARTE_Basile.pdf';
import ContactModal from "@/components/ContactModal.vue";
const currentYear = computed(() => new Date().getFullYear());
import { useModalStore } from '@/stores/useModalStore'

const modal = useModalStore()
// Fonction pour ouvrir la modale Contact
// À adapter selon votre implémentation (emit, store, etc.)
const openContactModal = () => {
  // Exemple : emit('open-contact-modal')
  // Ou : useModalStore().openContact()
  console.log('Ouvrir ContactModal');
};
</script>

<style scoped>
/* ===================================
   WRAPPER GÉNÉRAL
   =================================== */
.footer-wrapper {
  background: var(--color-bg);
  color: var(--color-text);
  width: 100%;
  position: relative;
}

.icon-download {
  width: 1.25rem;
  height: 1.25rem;
}

/* ===================================
   LIGNE DE SÉPARATION
   =================================== */
.footer-separator {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 2rem;
}

/* ===================================
   NIVEAU 1 : CONTENU PRINCIPAL (GRID)
   =================================== */
.footer-main {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding: 0 1rem 2rem 1rem;
  align-items: start;
}

/* --- Logo (colonne gauche) --- */
.footer-logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.logo-image {
  height: 10rem;
  width: auto;
  object-fit: contain;
}

/* --- Menu (colonne centre) --- */
.footer-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-title {
  font-family: var(--font-display), sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-subtitle);
  margin: 0 0 0.5rem 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-list a {
  font-size: 0.85rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
}

.menu-list a:hover {
  color: var(--color-accent);
}

/* Lien CV avec icône flèche */
.cv-link {
  font-size: 0.85rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  position: relative;
}

.cv-link:hover {
  color: var(--color-accent);
}

.cv-link:hover::after {
  opacity: 1;
}

/* --- Socials (colonne droite) --- */
.footer-socials {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.socials-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-icon {
  width: 16px;
  height: 16px;
  filter: invert(1);
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.social-link:hover {
  color: var(--color-accent);
}

.social-link:hover .social-icon {
  opacity: 1;
}

/* ===================================
   NIVEAU 2 : LIGNE INFÉRIEURE (FLEXBOX)
   =================================== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.75rem;
}

.footer-copyright,
.footer-brand,
.footer-legal {
  margin: 0;
  color: var(--color-text);
  opacity: 0.8;
}

.footer-brand {
  font-family: var(--font-display), sans-serif;
  font-weight: 300;
}

.footer-contact-btn {
  all: unset;
  cursor: pointer;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  color: var(--color-accent);
}


.footer-contact-btn:hover {
  color: var(--color-text);
}
/* ===================================
   RESPONSIVE MOBILE (<768px)
   =================================== */
@media (max-width: 768px) {
  /* Niveau 1 : colonnes stackées */
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    padding: 0 1.5rem 2rem 1.5rem;
  }

  .footer-logo {
    justify-content: center;
  }

  .logo-image {
    height: 3rem;
  }

  .footer-menu,
  .footer-socials {
    align-items: center;
  }

  .menu-list,
  .socials-list {
    align-items: center;
  }

  /* Niveau 2 : centrage vertical */
  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    padding: 1.5rem 1.5rem;
  }
}
</style>