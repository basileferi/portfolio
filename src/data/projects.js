// ============================================================
// HOW TO ADD A NEW PROJECT — 3 steps, zero imports needed
// ============================================================
// 1. Create folder:  public/projects/your-slug/
//    └── preview.jpg   → thumbnail (3D panel + card)
//    └── 1.jpg, 2.jpg  → gallery images (project detail page)
//
// 2. Add a defineProject({...}) entry to the array below
//
// 3. Push. Done.
//
// Fields:
//   title       — display name
//   slug        — kebab-case URL id  (leave empty for external-only projects)
//   subtitle    — short one-liner
//   preview     — image path (use '/projects/slug/preview.jpg' for public/ assets)
//   image       — hero banner (defaults to preview)
//   media       — array of image paths for gallery (optional, defaults [])
//   description — HTML string
//   tech_stack  — comma-separated string
//   link        — external URL or '' (optional)
//   year        — '2024' etc. (optional)
// ============================================================

export function defineProject(config) {
    return {
        media: [],
        link: '',
        year: '',
        ...config,
        image: config.image ?? config.preview,
    };
}

// --- Legacy asset imports (existing projects) ---
import LimboPreview  from '@/assets/projects/suitlimbo/1.png';
import LimboPreview2 from '@/assets/projects/suitlimbo/2.png';
import LimboPreview3 from '@/assets/projects/suitlimbo/3.png';
import LimboPreview4 from '@/assets/projects/suitlimbo/4.png';
import LimboPreview5 from '@/assets/projects/suitlimbo/5.png';
import LimboPreview6 from '@/assets/projects/suitlimbo/6.png';
import LimboPreview7 from '@/assets/projects/suitlimbo/7.png';
import LimboPreview8 from '@/assets/projects/suitlimbo/8.png';
import LimboPreview9 from '@/assets/projects/suitlimbo/9.png';

import PlayTestPreview  from '@/assets/projects/playtest/1.png';
import PlayTestPreview2 from '@/assets/projects/playtest/2.png';

import SneakersPreview from '@/assets/projects/sneakers/sneakers.png';
import Kosmo           from '@/assets/projects/Kosmo/Kosmo.png';

const TylerPreview  = '/projects/MiniSite/img/chromakopia_2.jpg';
const LeafletPreview = '/projects/Manuel/leaflet.png';

const linkTyler   = '/projects/MiniSite/html_mini_site/index.html';
const linkLeaflet = '/projects/Manuel/man.html';

// ============================================================
export default [

    // NEW PROJECT — add yours following this pattern ↓
    defineProject({
        title: "ESOP - G2eLab",
        slug: "esop-g2elab",
        subtitle: "Application métier pour la recherche scientifique",
        preview: "/projects/esop-g2elab/preview.svg",
        media: [],
        year: "2025",
        description: `
<p>Stage d'immersion professionnelle de huit semaines au <strong>G2eLab</strong> (Laboratoire de Génie Électrique de Grenoble), laboratoire spécialisé dans les microréseaux (<em>smart grids</em>).</p>

<p>Mission : rendre accessible une bibliothèque de calcul scientifique propriétaire via une interface moderne, en livrant un outil fonctionnel qui simplifie le travail quotidien d'un chercheur.</p>

<h3>Architecture</h3>
<ul>
  <li><strong>Backend - FastAPI (Python) :</strong> API RESTful haute performance avec documentation Swagger automatique. Interfacée avec la bibliothèque de calcul interne, les résultats complexes sont traduits en structures JSON exploitables.</li>
  <li><strong>Frontend - Vue 3 (SPA) :</strong> Interface responsive permettant la visualisation dynamique des simulations sous deux formes — graphique (courbes de charge) et scalaire (métriques de performance).</li>
</ul>

<h3>Apports</h3>
<p>Ce stage a confirmé mon envie de continuer vers la création de logicielle appliquée à la science : manipuler des données, collaborer avec un expert du domaine, et livrer un outil robuste de A à Z en autonomie.</p>`,
        tech_stack: "Vue 3, FastAPI (Python), RESTful API, Swagger / OpenAPI",
        link: "https://esop.g2elab.grenoble-inp.fr/",
    }),

    defineProject({
        title: "Kosmo.",
        slug: "kosmo",
        subtitle: "Portfolio 3D interactif — site actuel",
        preview: Kosmo,
        year: "2024",
        description: "<p>Développement et conception d'une expérience 3D immersive pour présenter mes projets. Optimisation des performances de rendu Three.js, réduisant les temps de chargement de la scène de 30 %. Déploiement sur Infomaniak via un pipeline CI/CD simple avec GitHub Actions.</p>",
        tech_stack: "Vue 3, Three.js, GSAP, Tailwind CSS, Pinia, Vite",
        link: "",
    }),

    defineProject({
        title: "Playtest",
        slug: "playtest",
        subtitle: "Site de notation de jeux vidéo",
        preview: PlayTestPreview,
        media: [PlayTestPreview, PlayTestPreview2],
        year: "2024",
        description: "<p>Plateforme communautaire permettant aux utilisateurs de se connecter, noter des jeux sur 5 et laisser des commentaires. Calcul de la note moyenne en temps réel, base de données MariaDB, architecture complète MVC.</p>",
        tech_stack: "PHP, MariaDB, HTML & CSS, JavaScript",
        link: "https://github.com/basileferi/playtest",
    }),

    defineProject({
        title: "SuitLimbo",
        slug: "suitlimbo",
        subtitle: "Gestion de contenus et déploiement AWS",
        preview: LimboPreview2,
        media: [LimboPreview, LimboPreview2, LimboPreview3, LimboPreview4, LimboPreview5, LimboPreview6, LimboPreview7, LimboPreview8, LimboPreview9],
        year: "2024",
        description: "<p>Site e-commerce de costumes développé avec WordPress et l'extension Elementor. Déploiement et hébergement sur Amazon Web Services.</p>",
        tech_stack: "WordPress, Elementor, Amazon Web Services",
    }),

    defineProject({
        title: "E-commerce Sneakers",
        slug: "boutique-sneakers",
        subtitle: "Boutique e-commerce dynamique avec gestion CSV",
        preview: SneakersPreview,
        year: "2023",
        description: "<p>Site e-commerce dynamique chargeant les produits depuis un fichier CSV. Système de panier, tri JavaScript en page boutique, et header changeant de couleur selon l'heure de connexion de l'utilisateur.</p>",
        tech_stack: "HTML, CSS, PHP, JavaScript, Bootstrap",
        video: "https://www.youtube.com/embed/y2tu4FJsBso",
    }),

    // External / static sites — no detail page (slug intentionally empty)
    defineProject({
        title: "Leaflet.js",
        slug: "",
        subtitle: "Manuel d'utilisation du plugin Leaflet.js",
        preview: LeafletPreview,
        year: "2023",
        description: "<p>Création d'un site web servant de manuel d'utilisation pour intégrer le plugin Leaflet.js à un site web.</p>",
        tech_stack: "JavaScript, HTML & CSS",
        link: linkLeaflet,
    }),

    defineProject({
        title: "Tyler, The Creator",
        slug: "",
        subtitle: "Mini-site vitrine pour un artiste",
        preview: TylerPreview,
        year: "2023",
        description: "<p>Promotion d'un artiste via un mini-site web intégrant un formulaire de contact et des animations CSS.</p>",
        tech_stack: "HTML & CSS",
        link: linkTyler,
    }),

];
