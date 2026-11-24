<template>
  <div class="legal-wrapper">
    <Header />

    <section class="breadcrumb">
      <Breadcrumb current="Mentions légales" />
    </section>

    <main class="legal-page">
      <h1 class="legal-main-title">Mentions légales</h1>

      <!-- Section 1 : Éditeur -->
      <section class="legal-section">
        <h2 class="legal-subtitle">Éditeur du site</h2>
        <p>
          Ce site est édité par <strong>Basile Ferrand-Richarte</strong>,
          créateur et propriétaire du présent portfolio. Intitulé "Kosmo."
        </p>
        <p>
          <strong>Contact :</strong> basileferi.pro@proton.me <button @click="copyToClipboard" class="btn-inner"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>Copier mon Mail</title><g id="copy_line" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F9F9F9FF' d='M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z'/></g></svg>
        </button>
        </p>
      </section>

      <!-- Section 2 : Hébergeur -->
      <section class="legal-section">
        <h2 class="legal-subtitle">Hébergement</h2>
        <p>
          Ce site est hébergé par <a href="https://www.infomaniak.com"><strong>Infomaniak Network SA</strong>.</a>
        </p>
        <p>
          Rue Eugène-Marziano 25, 1227 Les Acacias, Genève, Suisse<br>
        </p>
      </section>

      <!-- Section 3 : Données personnelles / RGPD -->
      <section class="legal-section">
        <h2 class="legal-subtitle">Protection des données personnelles</h2>

        <h3 class="legal-subheading">Collecte des données</h3>
        <p>
          Le formulaire de contact présent sur ce site utilise le service
          <strong>Formspree</strong> pour l'envoi des messages. Les données
          collectées (nom, adresse e-mail, message) sont strictement utilisées
          pour répondre à votre demande et ne sont jamais partagées, vendues
          ou exploitées à des fins commerciales.
        </p>

        <h3 class="legal-subheading">Vos droits</h3>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD),
          vous disposez d'un droit d'accès, de rectification et de suppression
          de vos données personnelles. Pour exercer ces droits, contactez-moi
          via mail : basileferi.pro@proton.me <button @click="copyToClipboard" class="btn-inner"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>Copier mon Mail</title><g id="copy_line" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F9F9F9FF' d='M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z'/></g></svg>
        </button>

        </p>

        <h3 class="legal-subheading">Cookies</h3>
        <p>
          Ce site n'utilise aucun cookie de profilage, de tracking publicitaire
          ou d'analyse comportementale. Seuls des cookies techniques essentiels
          au bon fonctionnement du site peuvent être utilisés.
        </p>

        <h3 class="legal-subheading">Conservation des données</h3>
        <p>
          Les messages envoyés via le formulaire de contact sont conservés
          uniquement le temps nécessaire au traitement de votre demande.
          Vous pouvez demander leur suppression à tout moment.
        </p>
      </section>

      <!-- Section 4 : Propriété intellectuelle -->
      <section class="legal-section">
        <h2 class="legal-subtitle">Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, images,
          graphismes, logo, design, structure) sont la propriété exclusive
          de <strong>Basile Ferrand-Richarte</strong>, sauf mention contraire.
        </p>
        <p>
          Toute reproduction, distribution, modification, adaptation,
          retransmission ou publication de ces différents éléments est
          strictement interdite sans l'accord écrit préalable de l'auteur.
        </p>
        <p>
          Les marques, logos et éléments graphiques de tiers mentionnés
          sur ce site restent la propriété de leurs détenteurs respectifs.
        </p>
      </section>

      <!-- Section 5 : Limitations de responsabilité -->
      <section class="legal-section">
        <h2 class="legal-subtitle">Limitations de responsabilité</h2>

        <h3 class="legal-subheading">Contenu du site</h3>
        <p>
          Basile Ferrand-Richarte s'efforce de maintenir les informations
          diffusées sur ce site à jour et exactes. Toutefois, des erreurs
          ou omissions peuvent survenir. L'éditeur ne saurait être tenu
          responsable des dommages directs ou indirects résultant de
          l'utilisation du site ou de l'impossibilité d'y accéder.
        </p>

        <h3 class="legal-subheading">Liens externes</h3>
        <p>
          Ce site peut contenir des liens vers des sites externes.
          L'éditeur n'exerce aucun contrôle sur ces sites et décline
          toute responsabilité quant à leur contenu, leur disponibilité
          ou leurs pratiques en matière de protection des données.
        </p>

        <h3 class="legal-subheading">Disponibilité du site</h3>
        <p>
          L'éditeur s'efforce d'assurer une disponibilité optimale du site,
          mais ne peut garantir une accessibilité permanente. Le site peut
          être temporairement indisponible en raison de maintenances techniques
          ou de circonstances indépendantes de la volonté de l'éditeur.
        </p>
      </section>

      <!-- Section 6 : Crédits (optionnel) -->
      <section class="legal-section">
        <h2 class="legal-subtitle">Crédits</h2>
        <p>
          <strong>Design et développement :</strong> Basile Ferrand-Richarte
        </p>
        <p>
          <strong>Technologies utilisées :</strong> Vue.js, Vite.js CSS, HTML, JavaScript, Tailwind.css, GSAP, Three.js, Pinia, Formspree
        </p>
        <p>
          <strong>Icônes :</strong> <a class="link" href="https://www.mingcute.com/">Mingcute</a>
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

useSmoothScroll({ wrapper: ".legal-wrapper" });

const MailToCopy = "basileferi.pro@proton.me"; // remplace par ton texte

function copyToClipboard() {
  navigator.clipboard.writeText(MailToCopy)
      .then(() => {
        alert("Email basileferi.pro@proton.me copié dans le presse-papiers !");
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