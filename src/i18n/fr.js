// Textes français. Jamais de tiret cadratin ici.
export default {
  meta: {
    title: 'BasileFeRi - Kosmo.',
    description:
      "Portfolio de Basile Ferrand-Richarte, développeur web basé en France et disponible pour des opportunités en France, en Suisse et à l'international. En recherche d'un stage de 14 à 17 semaines à partir du 22 février 2027.",
  },

  lang: {
    group: 'Langue',
    curtain: 'FRANÇAIS',
    en: { short: 'EN', label: 'English' },
    fr: { short: 'FR', label: 'Français' },
    switchTo: 'Passer en {label}',
  },

  routes: {
    projects: 'Projets',
    about: 'À propos',
    legal: 'Mentions légales',
    project: 'Projet',
  },

  common: {
    untitled: 'Sans titre',
    cv: 'Télécharger mon CV',
    cvShort: 'CV',
    contactMe: 'Me contacter',
    copyEmail: 'Copier mon adresse e-mail',
    emailCopied: 'Adresse e-mail {email} copiée dans le presse-papiers.',
    logoAlt: 'Logo Kosmo',
  },

  header: {
    by: 'par BASILE FERRAND-RICHARTE',
    projects: 'PROJETS',
    about: 'À PROPOS',
    contact: 'ME CONTACTER',
    menu: 'Menu',
  },

  footer: {
    menu: 'Menu',
    nav: 'Navigation du pied de page',
    home: 'Accueil',
    about: 'À propos',
    contact: 'Me contacter',
    social: 'Réseaux',
    socialNav: 'Réseaux sociaux',
    logoAlt: 'Logo Basile Feri',
    legal: 'Mentions légales',
  },

  breadcrumb: {
    home: 'Accueil',
  },

  sound: {
    mute: 'Couper le son',
    unmute: 'Activer le son',
    on: 'Son activé',
    off: 'Son coupé',
    labelOn: 'Son',
    labelOff: 'Muet',
  },

  lightbox: {
    dialog: '{title}, image {n} sur {total}',
    close: 'Fermer (Échap)',
    closeCursor: 'Fermer',
    prev: 'Image précédente (←)',
    prevCursor: 'Préc.',
    next: 'Image suivante (→)',
    nextCursor: 'Suiv.',
    thumbs: 'Miniatures',
    show: "Afficher l'image {n}",
    alt: '{title}, image {n}',
  },

  contact: {
    intro: 'Discutons ensemble, je suis certain de pouvoir être un atout pour votre équipe.',
    close: 'Fermer',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    message: 'Message',
    messagePlaceholder: 'Votre message...',
    emailButton: 'E-mail',
    send: 'Envoyer',
  },

  hero: {
    headline: 'Développeur',
    tagline: 'Découvrez ma façon de penser',
    cta: 'Mes projets',
    view: 'Voir',
    allProjects: 'Tous les projets',
    back: '← Retour',
    location: 'France · Suisse · International',
    based: "Disponible pour des opportunités en France, en Suisse et à l'international.",
    pitch:
      "Étudiant en 3e année, filière multimédia et développement web. Je conçois et livre des produits web complets, alliant conception d'interfaces, développement front-end et back-end",
    availability: "En recherche d'un stage de 14 à 17 semaines à partir du 22 février 2027.",
    choose: 'Choisissez un projet',
  },

  grid: {
    view: 'Voir',
    all: 'Tous les projets →',
  },

  projects: {
    eyebrow: 'Index des travaux · {year}',
    title: 'Projets',
    leadA: "Développement web, expériences 3D et design d'interface. Chaque fiche résume en un coup d'œil ",
    leadStrong: 'le contexte, mon rôle et la stack',
    leadB: '.',
    filterGroup: 'Filtrer par catégorie',
    all: 'Tous',
    viewGroup: 'Affichage',
    list: 'Liste',
    grid: 'Grille',
    headNo: 'N°',
    headProject: 'Projet',
    headCategory: 'Catégorie',
    headStack: 'Stack',
    headYear: 'Année',
    view: 'Voir',
    cardAlt: 'Aperçu du projet {title}',
    stack: 'Technologies',
    unavailable: 'Les projets sont momentanément indisponibles. Réessayez dans un instant.',
    empty: "Aucun projet publié pour l'instant.",
  },

  project: {
    draft: "Aperçu d'un brouillon, non visible du public",
    allProjects: 'Tous les projets',
    kbdNavigate: 'naviguer',
    kbdEsc: 'Échap',
    kbdIndex: 'index',
    position: 'Position du projet',
    openCursor: 'Ouvrir',
    live: 'Voir le projet en ligne',
    codeCursor: 'Code',
    source: 'Code source',
    details: 'Détails',
    enlarge: 'Agrandir',
    enlargeCover: "Agrandir l'image de couverture de {title}",
    coverAlt: '{title}, aperçu',
    keyPoints: 'Points clés',
    stack: 'Technologies',
    highlights: 'À retenir',
    story: 'Le projet',
    video: 'Démo vidéo',
    videoTitle: 'Vidéo de présentation : {title}',
    gallery: 'Galerie',
    galleryCount: ({ n }) => `${n} image${n > 1 ? 's' : ''} · cliquez pour agrandir`,
    enlargeImage: "Agrandir l'image {i} sur {n}",
    shotAlt: '{title}, capture {i}',
    next: 'Projet suivant',
    nextCursor: 'Suivant',
    viewAll: 'Voir tous les projets',
    ctaKicker: 'Vous recrutez ?',
    ctaTitle: 'Parlons de votre équipe.',
    about: 'À propos',
    dock: 'Navigation entre les projets',
    dockIndex: 'Tous les projets (Échap)',
    dockIndexLabel: 'Index',
    prevAria: 'Projet précédent : {title} (flèche gauche)',
    nextAria: 'Projet suivant : {title} (flèche droite)',
    facts: { role: 'Rôle', context: 'Contexte', year: 'Année', stack: 'Stack' },
  },

  about: {
    breadcrumb: 'À propos',
    titleA: 'Votre futur',
    titleB: ' développeur',
    subtitle:
      "Je suis Basile, étudiant en 3e année de BUT MMI (Métiers du Multimédia et de l'Internet), passionné par les produits web soignés et les expériences numériques immersives.",
    availability: 'Disponible pour un stage de 14 à 17 semaines à partir du 22 février 2027 · France, Suisse ou international',
    myProjects: '→ Mes projets ←',
    sections: [
      {
        title: "Bonjour, je m'appelle Basile",
        text: "Je suis en 3e année de BUT MMI, en formation initiale, avec une spécialisation en développement web. En parallèle de mes études, je me forme continuellement à de nouveaux langages, frameworks et technologies pour créer des expériences web captivantes, performantes et immersives.",
        accent: 'Développeur créatif',
        label: 'Apprentissage',
      },
      {
        title: 'Mes projets en MMI',
        text: "Dans mes projets de groupe à l'IUT, j'ai souvent été la personne qui fait le lien entre le design et la technique. J'aime imaginer une interface, puis lui donner vie dans le navigateur. Même si ces projets n'étaient pas tous orientés web, ils m'ont appris à travailler efficacement en équipe, à défendre des choix UX/UI et à traduire des idées en solutions concrètes.",
        accent: 'La technologie au service du design',
        label: "Travail d'équipe",
      },
      {
        title: 'Impact et résultats',
        text: "Je développe des interfaces accessibles, structurées et responsives. Mon but est simple : rendre l'expérience agréable pour l'utilisateur. J'accorde autant d'importance à la qualité du code qu'à l'esthétique du résultat.",
        accent: 'Qualité',
        label: 'Impact',
      },
      {
        title: 'Ce que je veux construire demain',
        text: "Je veux continuer à progresser en développement web, explorer de nouveaux frameworks et créer des produits plus rapides, plus immersifs et plus utiles. J'apprends un peu chaque jour, dans mes projets d'études comme dans mes projets personnels.",
        accent: "Gagner de l'expérience",
        label: 'Devenir développeur confirmé',
      },
    ],
    skillsTitle: 'Mes compétences techniques',
    skills: {
      frontend: { label: 'Front-end', items: 'JavaScript, Vue.js (Composition API, Pinia), GSAP, Three.js, CSS, Tailwind, Bootstrap' },
      design: { label: 'Design UI/UX', items: "User flows, maquettes Figma animées, prototypage UI/UX, design d'expérience" },
      backend: { label: 'Back-end', items: 'PHP, Node.js' },
      database: { label: 'Bases de données', items: 'SQL, MariaDB (requêtes, gestion de bases)' },
      deploy: { label: 'Déploiement', items: 'Amazon Web Services, Infomaniak, OVH, CI/CD, Git, GitHub Actions' },
      seo: { label: 'SEO', items: 'HTML sémantique, HaloScan' },
      other: { label: 'Autres', items: 'Bash, WordPress, Figma, Adobe Creative Suite, Canva, Blender' },
    },
    kosmoMask: 'K____ ?',
    kosmoTitle: 'Kosmo ?',
    kosmoText:
      "Qu'est-ce que Kosmo ? C'est un pseudonyme que j'utilise parfois sur Internet. J'ai choisi ce nom car Kosmo fait partie de mon identité sur le Web, tout comme ce portfolio. C'est mon tout premier site utilisant les bibliothèques GSAP et Three.js : j'ai adoré en apprendre les bases tout au long de son développement.",
    kosmoAccent: '→ Mon portfolio de futur développeur web',
    ctaTitle: 'Prêt à discuter ?',
    ctaLink: 'Contactez-moi',
    ctaText: ' ou explorez mon portfolio complet pour découvrir mes derniers projets.',
    ctaButton: 'ME CONTACTER',
    projects: 'Projets',
  },

  legal: {
    title: 'Mentions légales',
    publisher: {
      title: 'Éditeur du site',
      text: 'Ce site est édité par <strong>Basile Ferrand-Richarte</strong>, créateur et propriétaire du présent portfolio, intitulé « Kosmo ».',
      contact: 'Contact :',
    },
    hosting: {
      title: 'Hébergement',
      text: 'Ce site est hébergé par',
      address: 'Rue Eugène-Marziano 25, 1227 Les Acacias, Genève, Suisse',
    },
    data: {
      title: 'Protection des données personnelles',
      collectionTitle: 'Collecte des données',
      collection:
        "Le formulaire de contact présent sur ce site utilise le service <strong>Formspree</strong> pour l'envoi des messages. Les données collectées (nom, adresse e-mail, téléphone si renseigné, message) sont strictement utilisées pour répondre à votre demande et ne sont jamais partagées, vendues ou exploitées à des fins commerciales.",
      rightsTitle: 'Vos droits',
      rights:
        "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-moi par e-mail :",
      cookiesTitle: 'Cookies',
      cookies:
        "Ce site n'utilise aucun cookie de profilage, de tracking publicitaire ou d'analyse comportementale. Seul un stockage technique, nécessaire au bon fonctionnement du site, peut être utilisé, par exemple pour mémoriser votre langue et vos préférences de son.",
      retentionTitle: 'Conservation des données',
      retention:
        'Les messages envoyés via le formulaire de contact sont conservés uniquement le temps nécessaire au traitement de votre demande. Vous pouvez demander leur suppression à tout moment.',
    },
    ip: {
      title: 'Propriété intellectuelle',
      p1: "L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, design, structure) est la propriété exclusive de <strong>Basile Ferrand-Richarte</strong>, sauf mention contraire.",
      p2: "Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord écrit préalable de l'auteur.",
      p3: 'Les marques, logos et éléments graphiques de tiers mentionnés sur ce site restent la propriété de leurs détenteurs respectifs.',
    },
    liability: {
      title: 'Limitations de responsabilité',
      contentTitle: 'Contenu du site',
      content:
        "Basile Ferrand-Richarte s'efforce de maintenir les informations diffusées sur ce site à jour et exactes. Toutefois, des erreurs ou omissions peuvent survenir. L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.",
      linksTitle: 'Liens externes',
      links:
        "Ce site peut contenir des liens vers des sites externes. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs pratiques en matière de protection des données.",
      availabilityTitle: 'Disponibilité du site',
      availability:
        "L'éditeur s'efforce d'assurer une disponibilité optimale du site, mais ne peut garantir une accessibilité permanente. Le site peut être temporairement indisponible en raison de maintenances techniques ou de circonstances indépendantes de la volonté de l'éditeur.",
    },
    credits: {
      title: 'Crédits',
      design: 'Design et développement :',
      tech: 'Technologies utilisées :',
      icons: 'Icônes :',
    },
  },
}
