import LimboPreview from '@/assets/projects/suitlimbo/1.png';
import LimboPreview2 from '@/assets/projects/suitlimbo/2.png';
import LimboPreview3 from '@/assets/projects/suitlimbo/3.png';
import LimboPreview4 from '@/assets/projects/suitlimbo/4.png';
import LimboPreview5 from '@/assets/projects/suitlimbo/5.png';
import LimboPreview6 from '@/assets/projects/suitlimbo/6.png';
import LimboPreview7 from '@/assets/projects/suitlimbo/7.png';
import LimboPreview8 from '@/assets/projects/suitlimbo/8.png';
import LimboPreview9 from '@/assets/projects/suitlimbo/9.png';
import LimboPreview10 from '@/assets/projects/suitlimbo/9.png';

import PlayTestPreview from '@/assets/projects/playtest/1.png';
import PlayTestPreview2 from '@/assets/projects/playtest/2.png';

import SneakersPreview from '@/assets/projects/sneakers/sneakers.png';
import Kosmo from '@/assets/projects/Kosmo/Kosmo.png';

const TylerPreview = '/projects/MiniSite/img/chromakopia_2.jpg';
const LeafletPreview = '/projects/Manuel/leaflet.png';



const linkTyler = '/projects/MiniSite/html_mini_site/index.html'
const linkLeaflet = '/projects/Manuel/man.html';

export default [
    {
        title: "Kosmo.",
        slug: "kosmo",
        subtitle: '"Kosmo." | Portfolio 3D Interactif | Site actuel',
        preview: Kosmo,
        image: Kosmo,
        description: "<p>Développement et conçeption d’une expérience 3D immersive pour présenter mes projets. Optimisation des performances de rendu Three.js, réduisant les temps de chargement de ma scène Three de 30%. Déploiement du site sur Infomaniak via un pipeline DevOps simple avec GitHub Actions.</p>",
        tech_stack: "Vue 3, Three.js, GSAP, JavaScript, Node.js, Tailwind.css, Pinia",
        link: "",
    },
    {
        title: "Playtest",
        slug: "playtest",
        subtitle: '"PlayTest" | Site de notation de jeux vidéo',
        preview: PlayTestPreview,
        image: PlayTestPreview,
        media: [PlayTestPreview, PlayTestPreview2],
        description: "<p>Élaboration d'un site avec sa base de données permettant à ses utilisateurs de se connecter, de noter des jeux sur 5, de laisser des commentaires et d'interagir en communauté de joueurs. Calcul de la note moyenne des jeux en temps réel selon celles des utilisateurs. Consultation de nombreux jeux, architecture complète de cette plateforme web avec base de données MariaDB, soumission et consultation de nombreuses notes utilisateurs</p>",
        tech_stack: "PHP, MariaDB, HTML & CSS, JavaScript",
        link: "https://github.com/basileferi/playtest",
    },
    {
        title: "SuitLimbo",
        slug: "SuitLimbo | Site de vente de costumes",
        subtitle: '"SuitLimbo" | Gestion de contenus et déploiement AWS',
        preview: LimboPreview2,
        image: LimboPreview2,
        media: [LimboPreview, LimboPreview2, LimboPreview3, LimboPreview4, LimboPreview5, LimboPreview6, LimboPreview7, LimboPreview8, LimboPreview9, LimboPreview10],
        description: "<p>Site web avec une solution de gestion de contenus Wordpress avec l'extension Elementor.</p>",
        tech_stack: "Wordpress / Elementor / Amazon Web Service",
        link: ""
    },
    {
        title: "Leaflet.js Man",
        slug: "Leaflet.js Man",
        subtitle: "Manuel d'utilisation du plugin Leaflet.js",
        preview: LeafletPreview,
        image: LeafletPreview,
        description: "<p>Création d'un site web servant de manuel d'utilisation pour intégrer le plugin Leaflet.js à un site web.</p>",
        tech_stack: "JavaScript, HTML & CSS",
        link: linkLeaflet
    },
    {
        title: "Tyler, The Creator",
        slug: "Tyler, The Creator",
        subtitle: 'Conception d’un site vitrine pour un artiste',
        preview: TylerPreview,
        image: TylerPreview,
        description: "<p>Promotion d'un artiste via un mini-site web intégrant un formulaire de contact et des animations CSS. </p>",
        tech_stack: "HTML & CSS",
        link: linkTyler
    },

    {
        title: "E-commerce | Boutique Sneakers",
        slug: "Boutique Sneakers",
        subtitle: "Conception d’un site pour une boutique de sneakers fictive. Développement d’un site e-commerce dynamique avec gestion des produits en PHP, fichier CSV. Implémentation d'un système de panier, gérant plus de 10 références produits.",
        preview: SneakersPreview,
        image: SneakersPreview,
        description: "<p>Ce site charge les produits depuis un fichier CSV et les affiche en colonne avec Bootstrap. De plus, une fonctionnalité de tri en JavaScript est disponible sur la page boutique. Enfin, ce site change la couleur de son header en fonction de l'heure de connexion de l'utilisateur. </p>",
        tech_stack: "HTML, CSS, PHP, JavaScript, Bootstrap",
        link: "",
        video: "https://www.youtube.com/embed/y2tu4FJsBso"
    },

];
