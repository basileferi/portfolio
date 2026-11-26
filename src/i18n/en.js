// English copy (default language). Never use the em dash character here.
export default {
  meta: {
    title: 'BasileFeRi - Kosmo.',
    description:
      'Portfolio of Basile Ferrand-Richarte, web developer based in France and open to opportunities in Switzerland and worldwide. Looking for a 14 to 17-week internship from 22 February 2027.',
  },

  lang: {
    group: 'Language',
    curtain: 'ENGLISH',
    en: { short: 'EN', label: 'English' },
    fr: { short: 'FR', label: 'Français' },
    switchTo: 'Switch to {label}',
  },

  routes: {
    projects: 'Projects',
    about: 'About',
    legal: 'Legal notice',
    project: 'Project',
  },

  common: {
    untitled: 'Untitled',
    cv: 'Download my CV (French)',
    cvShort: 'CV (FR)',
    contactMe: 'Get in touch',
    copyEmail: 'Copy my email address',
    emailCopied: 'Email address {email} copied to the clipboard.',
    logoAlt: 'Kosmo logo',
  },

  header: {
    by: 'by BASILE FERRAND-RICHARTE',
    projects: 'PROJECTS',
    about: 'ABOUT',
    contact: 'GET IN TOUCH',
    menu: 'Menu',
  },

  footer: {
    menu: 'Menu',
    nav: 'Footer navigation',
    home: 'Home',
    about: 'About',
    contact: 'Get in touch',
    social: 'Social',
    socialNav: 'Social networks',
    logoAlt: 'Basile Feri logo',
    legal: 'Legal notice',
  },

  breadcrumb: {
    home: 'Home',
  },

  sound: {
    mute: 'Mute sound',
    unmute: 'Turn sound on',
    on: 'Sound on',
    off: 'Sound off',
    labelOn: 'Sound',
    labelOff: 'Muted',
  },

  lightbox: {
    dialog: '{title}, image {n} of {total}',
    close: 'Close (Esc)',
    closeCursor: 'Close',
    prev: 'Previous image (←)',
    prevCursor: 'Prev',
    next: 'Next image (→)',
    nextCursor: 'Next',
    thumbs: 'Thumbnails',
    show: 'Show image {n}',
    alt: '{title}, image {n}',
  },

  contact: {
    intro: "Let's talk. I'm confident I can be a real asset to your team.",
    close: 'Close',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    messagePlaceholder: 'Your message...',
    emailButton: 'Email',
    send: 'Send',
  },

  hero: {
    headline: 'Developer',
    tagline: 'Explore how I think',
    cta: 'My projects',
    view: 'View',
    allProjects: 'All projects',
    back: '← Back',
    location: 'France · Switzerland · International',
    based: 'Based in France, open to opportunities in Switzerland & worldwide.',
    pitch:
      'Third-year Multimedia and Web Development student. I design and deliver complete web products, combining interface design with front-end and back-end development.',
    availability: 'Looking for a 14 to 17-week internship from 22 February 2027.',
    choose: 'Choose a project',
  },

  grid: {
    view: 'View',
    all: 'All projects →',
  },

  projects: {
    eyebrow: 'Work index · {year}',
    title: 'Projects',
    leadA: 'Web development, 3D experiences and interface design. Each case study shows ',
    leadStrong: 'the context, my role and the stack',
    leadB: ' at a glance.',
    filterGroup: 'Filter by category',
    all: 'All',
    viewGroup: 'Layout',
    list: 'List',
    grid: 'Grid',
    headNo: 'No.',
    headProject: 'Project',
    headCategory: 'Category',
    headStack: 'Stack',
    headYear: 'Year',
    view: 'View',
    cardAlt: 'Preview of the {title} project',
    stack: 'Tech stack',
    unavailable: 'Projects are temporarily unavailable. Please try again in a moment.',
    empty: 'No projects published yet.',
  },

  project: {
    draft: 'Draft preview, not visible to the public',
    allProjects: 'All projects',
    kbdNavigate: 'navigate',
    kbdEsc: 'Esc',
    kbdIndex: 'index',
    position: 'Project position',
    openCursor: 'Open',
    live: 'View the live project',
    codeCursor: 'Code',
    source: 'Source code',
    details: 'Details',
    enlarge: 'Enlarge',
    enlargeCover: 'Enlarge the cover image of {title}',
    coverAlt: '{title}, preview',
    keyPoints: 'Key points',
    stack: 'Tech stack',
    highlights: 'Highlights',
    story: 'The project',
    video: 'Video demo',
    videoTitle: 'Presentation video: {title}',
    gallery: 'Gallery',
    galleryCount: ({ n }) => `${n} image${n > 1 ? 's' : ''} · click to enlarge`,
    enlargeImage: 'Enlarge image {i} of {n}',
    shotAlt: '{title}, screenshot {i}',
    next: 'Next project',
    nextCursor: 'Next',
    viewAll: 'View all projects',
    ctaKicker: 'Hiring?',
    ctaTitle: "Let's talk about your team.",
    about: 'About',
    dock: 'Project navigation',
    dockIndex: 'All projects (Esc)',
    dockIndexLabel: 'Index',
    prevAria: 'Previous project: {title} (left arrow)',
    nextAria: 'Next project: {title} (right arrow)',
    facts: { role: 'Role', context: 'Context', year: 'Year', stack: 'Stack' },
  },

  about: {
    breadcrumb: 'About',
    titleA: 'Your next',
    titleB: ' developer',
    subtitle:
      "I'm Basile, a third-year student in BUT MMI (Métiers du Multimédia et de l'Internet, a French bachelor's degree in multimedia and web professions), and I love building polished web products and immersive digital experiences.",
    availability: 'Available for a 14 to 17-week internship from 22 February 2027 · France, Switzerland or worldwide',
    myProjects: '→ My projects ←',
    sections: [
      {
        title: "Hi, I'm Basile",
        text: "I'm in the third year of my BUT MMI, specialising in web development. Alongside my studies, I keep teaching myself new languages, frameworks and tools to build web experiences that are engaging, fast and immersive.",
        accent: 'Creative developer',
        label: 'Always learning',
      },
      {
        title: 'My MMI projects',
        text: 'In group projects at university, I was often the one bridging design and engineering. I love imagining an interface, then bringing it to life in the browser. Not every project was web-focused, but each one taught me to work well in a team, to stand behind UX/UI decisions and to turn ideas into concrete solutions.',
        accent: 'Technology serving design',
        label: 'Teamwork',
      },
      {
        title: 'Impact and results',
        text: 'I build interfaces that are accessible, well-structured and responsive. My goal is simple: make the experience enjoyable for the people using it. I care as much about the quality of the code as about how the result looks.',
        accent: 'Quality',
        label: 'Impact',
      },
      {
        title: 'What I want to build next',
        text: 'I want to keep growing as a web developer, explore new frameworks and build products that are faster, more immersive and more useful. I learn a little every day, in my coursework as much as in my personal projects.',
        accent: 'Gaining experience',
        label: 'Becoming an experienced developer',
      },
    ],
    skillsTitle: 'Technical skills',
    skills: {
      frontend: { label: 'Front-end', items: 'JavaScript, Vue.js (Composition API, Pinia), GSAP, Three.js, CSS, Tailwind, Bootstrap' },
      design: { label: 'UI/UX design', items: 'User flows, animated Figma mockups, UI/UX prototyping, experience design' },
      backend: { label: 'Back-end', items: 'PHP, Node.js' },
      database: { label: 'Databases', items: 'SQL, MariaDB (queries, database management)' },
      deploy: { label: 'Deployment', items: 'Amazon Web Services, Infomaniak, OVH, CI/CD, Git, GitHub Actions' },
      seo: { label: 'SEO', items: 'Semantic HTML, HaloScan' },
      other: { label: 'Other', items: 'Bash, WordPress, Figma, Adobe Creative Suite, Canva, Blender' },
    },
    kosmoMask: 'K____?',
    kosmoTitle: 'Kosmo?',
    kosmoText:
      "What is Kosmo? It's a pseudonym I sometimes go by online. I named this portfolio after it because Kosmo is part of my identity on the web, just like this site. It was my very first project using GSAP and Three.js, and I loved learning the fundamentals of both JavaScript libraries while building it.",
    kosmoAccent: '→ The portfolio of a web developer in the making',
    ctaTitle: 'Ready to talk?',
    ctaLink: 'Get in touch',
    ctaText: ' or browse my portfolio to discover my latest projects.',
    ctaButton: 'GET IN TOUCH',
    projects: 'Projects',
  },

  legal: {
    title: 'Legal notice',
    publisher: {
      title: 'Website publisher',
      text: 'This website is published by <strong>Basile Ferrand-Richarte</strong>, creator and owner of this portfolio, named "Kosmo."',
      contact: 'Contact:',
    },
    hosting: {
      title: 'Hosting',
      text: 'This website is hosted by',
      address: 'Rue Eugène-Marziano 25, 1227 Les Acacias, Geneva, Switzerland',
    },
    data: {
      title: 'Personal data protection',
      collectionTitle: 'Data collection',
      collection:
        'The contact form on this website uses the <strong>Formspree</strong> service to send messages. The data collected (name, email address, phone number if provided, message) is used solely to reply to your enquiry and is never shared, sold or used for commercial purposes.',
      rightsTitle: 'Your rights',
      rights:
        'Under the General Data Protection Regulation (GDPR), you have the right to access, rectify and delete your personal data. To exercise these rights, contact me by email:',
      cookiesTitle: 'Cookies',
      cookies:
        'This website uses no profiling, advertising or behavioural analytics cookies. Only technical storage that the website needs to work may be used, for example to remember your language and sound preferences.',
      retentionTitle: 'Data retention',
      retention:
        'Messages sent through the contact form are kept only as long as needed to handle your enquiry. You can ask for them to be deleted at any time.',
    },
    ip: {
      title: 'Intellectual property',
      p1: 'All content on this website (text, images, graphics, logo, design, structure) is the exclusive property of <strong>Basile Ferrand-Richarte</strong>, unless stated otherwise.',
      p2: "Any reproduction, distribution, modification, adaptation, retransmission or publication of these elements is strictly prohibited without the author's prior written consent.",
      p3: 'Third-party trademarks, logos and graphic elements mentioned on this website remain the property of their respective owners.',
    },
    liability: {
      title: 'Limitation of liability',
      contentTitle: 'Website content',
      content:
        'Basile Ferrand-Richarte strives to keep the information on this website accurate and up to date. However, errors or omissions may occur. The publisher cannot be held liable for any direct or indirect damage resulting from the use of the website or from being unable to access it.',
      linksTitle: 'External links',
      links:
        'This website may contain links to external websites. The publisher has no control over them and accepts no responsibility for their content, availability or data protection practices.',
      availabilityTitle: 'Website availability',
      availability:
        "The publisher strives to keep the website available but cannot guarantee uninterrupted access. The website may be temporarily unavailable due to technical maintenance or circumstances beyond the publisher's control.",
    },
    credits: {
      title: 'Credits',
      design: 'Design and development:',
      tech: 'Technologies used:',
      icons: 'Icons:',
    },
  },
}
