// ============================================================
// STATIC FALLBACK — projects are now managed from the back office
// (hidden admin URL, see README). This list is only used when the
// PHP API is unreachable (local `npm run dev` without PHP, DB down…).
//
// It mirrors the seed in database/001_backoffice.sql.
// Images live in public/projects/<slug>/ so their URLs are stable.
// ============================================================

export default [
  {
    title: 'ESOP - G2eLab',
    slug: 'esop-g2elab',
    subtitle: 'Application métier pour la recherche scientifique',
    category: 'Développement Web',
    year: '2025',
    context: 'Stage — G2eLab, Grenoble INP',
    role: 'Développeur full-stack',
    preview: '/projects/esop-g2elab/preview.svg',
    media: [],
    tech_stack: 'Vue 3, FastAPI (Python), RESTful API, Swagger / OpenAPI',
    link: 'https://esop.g2elab.grenoble-inp.fr/',
    highlights: [
      'Stage de 8 semaines en laboratoire de recherche (smart grids)',
      'API REST FastAPI avec documentation Swagger automatique',
      'SPA Vue 3 de visualisation des simulations : courbes et métriques',
      'Outil livré de A à Z en autonomie',
    ],
    description: `
<p>Stage d'immersion professionnelle de huit semaines au <strong>G2eLab</strong> (Laboratoire de Génie Électrique de Grenoble), laboratoire spécialisé dans les microréseaux (<em>smart grids</em>).</p>
<p>Mission : rendre accessible une bibliothèque de calcul scientifique propriétaire via une interface moderne, en livrant un outil fonctionnel qui simplifie le travail quotidien d'un chercheur.</p>
<h3>Architecture</h3>
<ul>
  <li><strong>Backend - FastAPI (Python) :</strong> API RESTful haute performance avec documentation Swagger automatique. Interfacée avec la bibliothèque de calcul interne, les résultats complexes sont traduits en structures JSON exploitables.</li>
  <li><strong>Frontend - Vue 3 (SPA) :</strong> Interface responsive permettant la visualisation dynamique des simulations sous deux formes — graphique (courbes de charge) et scalaire (métriques de performance).</li>
</ul>
<h3>Apports</h3>
<p>Ce stage a confirmé mon envie de continuer vers la création de logiciels appliqués à la science : manipuler des données, collaborer avec un expert du domaine, et livrer un outil robuste de A à Z en autonomie.</p>`,
  },
  {
    title: 'Kosmo.',
    slug: 'kosmo',
    subtitle: 'Portfolio 3D interactif — site actuel',
    category: 'Développement Web',
    year: '2024',
    context: 'Projet personnel',
    role: 'Design & développement',
    preview: '/projects/kosmo/preview.png',
    tech_stack: 'Vue 3, Three.js, GSAP, Tailwind CSS, Pinia, Vite, PHP, MariaDB',
    highlights: [
      'Scène Three.js avec post-processing (grain, scanlines, aberration chromatique)',
      'Temps de chargement de la scène réduit de 30 %',
      'Déploiement continu GitHub Actions → Infomaniak',
      'Back-office PHP / MariaDB pour gérer les projets',
    ],
    description: "<p>Développement et conception d'une expérience 3D immersive pour présenter mes projets. Optimisation des performances de rendu Three.js, réduisant les temps de chargement de la scène de 30 %. Déploiement sur Infomaniak via un pipeline CI/CD simple avec GitHub Actions.</p>",
  },
  {
    title: 'Playtest',
    slug: 'playtest',
    subtitle: 'Site de notation de jeux vidéo',
    category: 'Développement Web',
    year: '2024',
    context: 'Projet étudiant',
    role: 'Développeur full-stack',
    preview: '/projects/playtest/1.png',
    media: ['/projects/playtest/1.png', '/projects/playtest/2.png'],
    tech_stack: 'PHP, MariaDB, HTML & CSS, JavaScript',
    repo: 'https://github.com/basileferi/playtest',
    highlights: [
      'Comptes utilisateurs et authentification',
      'Notation sur 5 et commentaires',
      'Note moyenne recalculée en temps réel',
      'Architecture MVC et base MariaDB',
    ],
    description: '<p>Plateforme communautaire permettant aux utilisateurs de se connecter, noter des jeux sur 5 et laisser des commentaires. Calcul de la note moyenne en temps réel, base de données MariaDB, architecture complète MVC.</p>',
  },
  {
    title: 'SuitLimbo',
    slug: 'suitlimbo',
    subtitle: 'Gestion de contenus et déploiement AWS',
    category: 'Développement Web',
    year: '2024',
    context: 'Projet étudiant',
    role: 'Intégration & déploiement',
    preview: '/projects/suitlimbo/2.png',
    media: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `/projects/suitlimbo/${i}.png`),
    tech_stack: 'WordPress, Elementor, Amazon Web Services',
    highlights: [
      'Boutique e-commerce WordPress + Elementor',
      'Hébergement et déploiement sur Amazon Web Services',
    ],
    description: "<p>Site e-commerce de costumes développé avec WordPress et l'extension Elementor. Déploiement et hébergement sur Amazon Web Services.</p>",
  },
  {
    title: 'E-commerce Sneakers',
    slug: 'boutique-sneakers',
    subtitle: 'Boutique e-commerce dynamique avec gestion CSV',
    category: 'Développement Web',
    year: '2023',
    context: 'Projet étudiant',
    role: 'Développeur web',
    preview: '/projects/boutique-sneakers/preview.png',
    tech_stack: 'HTML, CSS, PHP, JavaScript, Bootstrap',
    video: 'https://www.youtube-nocookie.com/embed/y2tu4FJsBso',
    highlights: [
      'Catalogue produits chargé depuis un fichier CSV',
      'Panier et tri des produits en JavaScript',
      "Header dont la couleur suit l'heure de connexion",
    ],
    description: "<p>Site e-commerce dynamique chargeant les produits depuis un fichier CSV. Système de panier, tri JavaScript en page boutique, et header changeant de couleur selon l'heure de connexion de l'utilisateur.</p>",
  },
  {
    title: 'Leaflet.js',
    slug: 'leaflet-manuel',
    subtitle: "Manuel d'utilisation du plugin Leaflet.js",
    category: 'Développement Web',
    year: '2023',
    context: 'Projet étudiant',
    role: 'Rédaction & intégration',
    preview: '/projects/Manuel/leaflet.png',
    tech_stack: 'JavaScript, HTML & CSS',
    link: '/projects/Manuel/man.html',
    highlights: [
      'Documentation pas à pas pour intégrer une carte Leaflet.js',
      'Exemples de code interactifs',
    ],
    description: "<p>Création d'un site web servant de manuel d'utilisation pour intégrer le plugin Leaflet.js à un site web.</p>",
  },
  {
    title: 'Tyler, The Creator',
    slug: 'tyler-the-creator',
    subtitle: 'Mini-site vitrine pour un artiste',
    category: 'Développement Web',
    year: '2023',
    context: 'Projet étudiant',
    role: 'Intégration',
    preview: '/projects/MiniSite/img/chromakopia_2.jpg',
    tech_stack: 'HTML & CSS',
    link: '/projects/MiniSite/html_mini_site/index.html',
    highlights: ['Mini-site vitrine responsive', 'Formulaire de contact et animations CSS'],
    description: "<p>Promotion d'un artiste via un mini-site web intégrant un formulaire de contact et des animations CSS.</p>",
  },
]
