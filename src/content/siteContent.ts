// Editable website copy. Contact values live in siteLinks, projects in projects,
// articles in blogPosts, and colors in theme/colors.css.
export const siteContent = {
  brand: {
    name: "StickForYou",
  },

  // Home
  home: {
    headerLabel: "THE RIGHT MAN · THE WRONG PLACE",
    introductionLabel: "PLAYER PROFILE",
    founderPrefix: "CAPTAIN · ",
    name: "Sumit Kumar",
    designations: [
      "UI / UX focused developer",
      "Designing systems that scale",
      "Making “can we do this?” a yes",
      "Mobile-first experience developer",
      "System design specialist",
      "AI-powered product developer",
      "Pattern hunter · problem solver",
      "Professional button smasher",
      "Turning coffee into commits",
      "It works on my machine",
    ],
    headline: "Built with logic. Designed for people.",
    introduction:
      "I turn ideas into polished digital products—from interfaces and mobile apps to backend systems, AI features and interactive tools.",
    capabilitiesTitle: "WHAT I CAN SHIP",
    capabilitiesFlow: "PIXELS → LOGIC → PRODUCT",
    capabilities: [
      {
        number: "01",
        title: "UI / UX Development",
        description:
          "Responsive, accessible interfaces with clear flows and polished interaction design.",
      },
      {
        number: "02",
        title: "Web & Mobile Applications",
        description:
          "Full product experiences across web and mobile, from frontend interactions to connected data.",
      },
      {
        number: "03",
        title: "Backend & API Systems",
        description:
          "Authentication, databases, REST APIs and application logic built for reliable product workflows.",
      },
      {
        number: "04",
        title: "Interactive & AI Features",
        description:
          "Real-time interactions, intelligent features and custom experiences that extend beyond standard interfaces.",
      },
    ],
    contactLabel: "Contact information",
    contactQuestion: "HAVE SOMETHING IN MIND?",
    contactPrompt: "I’M LISTENING",
    portraitAltPrefix: "Portrait of ",
  },

  // Projects
  projects: {
    eyebrow: "PROJECTS / 02",
    meta: "QUEST LOG · COMPLETED BUILDS",
    heading: "Built, building, shipping.",
    introduction: "What’s in motion now, and what’s already live.",
    workingTitle: "CURRENTLY WORKING",
    liveTitle: "OUT IN THE WORLD",
    workingEmpty: "The workbench is clear. For now.",
    liveEmpty: "Released work will show up here.",
    footerWords: ["BUILD", "BREAK", "IMPROVE"],
    footerNote: "NEW GAME+",
    showcase: {
      active: "ACTIVE",
      released: "RELEASED",
      activeBuild: "ACTIVE BUILD",
      releasedWork: "RELEASED WORK",
      development: "IN DEVELOPMENT",
      openProject: "OPEN PROJECT",
      explore: "← EXPLORE →",
      play: "▶ PLAY",
      pause: "Ⅱ PAUSE",
      technologies: "Technologies",
      previous: "Previous ",
      next: "Next ",
      projectSuffix: " project: ",
      resumeRotation: "Resume ",
      pauseRotation: "Pause ",
      automaticRotation: " automatic rotation",
    },
  },

  // Forge
  forge: {
    eyebrow: "FORGE",
    index: "03",
    meta: "ENGINEERING CAPABILITIES",
    heading: "What I build.",
    introduction:
      "Interfaces, mobile apps, APIs and live features that work together.",
    capabilitiesTitle: "THE TOOLKIT",
    capabilitiesFlow: "IDEA → IMPLEMENTATION → SYSTEM",
    capabilities: [
      {
        number: "01",
        title: "WEB EXPERIENCES",
        description:
          "Responsive interfaces, interactive websites and polished product flows.",
        tools: "React · TypeScript · JavaScript · UI / UX",
      },
      {
        number: "02",
        title: "MOBILE APPLICATIONS",
        description:
          "Cross-platform mobile apps with authentication, connected data and interactive features.",
        tools: "React Native · Expo · Firebase",
      },
      {
        number: "03",
        title: "BACKEND & API SYSTEMS",
        description:
          "REST APIs, authentication, databases and server-side application logic.",
        tools: "Node.js · Express · MongoDB · Firebase Auth",
      },
      {
        number: "04",
        title: "REAL-TIME SYSTEMS",
        description:
          "Synchronized data, live interactions and event-driven product features.",
        tools: "Firestore · Firebase · Real-time Data",
      },
    ],
    activityTitle: "BUILD ACTIVITY",
    activityLabel: "GITHUB / CONTRIBUTION LOG",
    activityPeriod: "ONE ORBIT · STILL BUILDING",
    footerMotto: "THINK / BUILD / ITERATE",
    footerStatus: "XP STILL CLIMBING",
  },

  // Blog and full journal; article-specific content stays in blogPosts.ts.
  blog: {
    eyebrow: "BLOG / 04",
    meta: "ENGINEERING NOTES · BUILD LOG",
    headingLines: ["Thoughts from", "the process."],
    introduction:
      "Notes on what worked, what failed, and what I learned building it.",
    carouselLabel: "Engineering notes",
    topicsLabel: "Topics",
    previousArticle: "Previous article: ",
    nextArticle: "Next article: ",
    explore: "← READ BETWEEN THE BUILDS →",
    resumeRotation: "Resume automatic rotation",
    pauseRotation: "Pause automatic rotation",
    play: "▶ PLAY",
    pause: "Ⅱ PAUSE",
    footer: "THE FULL STORY, BEYOND THE CUBE.",
    viewAll: "VIEW ALL BLOGS",
  },
  journal: {
    navigationLabel: "Journal navigation",
    back: "← Back to portfolio",
    backFooter: "Back to portfolio ↗",
    brandSuffix: "JOURNAL",
    introductionSecondSentence:
      "A record of what is working, what is in progress, and what still needs proving.",
    countSuffix: "NOTES / AN OPEN NOTEBOOK",
    footer: "END OF NOTES / MORE TO BUILD",
    documentTitlePrefix: "Build notes · ",
  },

  // Contact
  contact: {
    eyebrow: "OPEN COMMS · 05",
    heading: "Your story could start here.",
    introduction: "Give me the outline. We’ll figure out the rest together.",
    documentTitlePrefix: "Contact · ",
    pageNavigationLabel: "Contact page navigation",
    pageBack: "← Back to portfolio",
    pageBrandSuffix: "CONTACT",
    gateway: {
      status: "CHANNEL / OPEN",
      heading: "Let's make something worth talking about.",
      introduction: "Have an idea, a product that needs shaping, or a problem worth solving?",
      categories: [
        { number: "01", title: "BUILD SOMETHING", detail: "Web · Mobile · Backend" },
        { number: "02", title: "IMPROVE SOMETHING", detail: "Product · UI · Systems" },
        { number: "03", title: "JUST TALK", detail: "Questions · Ideas · Opportunities" },
      ],
      action: "OPEN A CONVERSATION",
    },
    labels: {
      name: "Your name",
      email: "Email",
      company: "Company",
      type: "What do you need?",
      budget: "Approx. budget",
      timing: "Ideal timing",
      goals: "What’s the dream version?",
      optional: "OPTIONAL",
    },
    placeholders: {
      name: "Your name, captain.",
      email: "you@company.com",
      company: "Company, crew, or solo mission",
      type: "Choose your mission",
      budget: "Ballpark is perfectly fine",
      goals: "Start with the crazy idea. We'll figure out the physics later.",
    },
    projectTypes: [
      "Website or web app",
      "Mobile app",
      "Product design",
      "Something else",
    ],
    timelines: [
      "Still exploring",
      "As soon as possible",
      "Within 1–3 months",
      "Later this year",
    ],
    formNote: "No perfect brief needed. Just tell me what you want to build.",
    submit: "SEND THE IDEA",
    submitting: "SENDING...",
    cooldownButton: "COOLDOWN ACTIVE",
    successTitle: "TRANSMISSION RECEIVED",
    successMessage: [
      "Your message made it through.",
      "I’ll get back to you as soon as I can.",
    ],
    errorTitle: "TRANSMISSION FAILED",
    errorMessage: "Something went wrong. Please try again.",
    cooldownPrefix: "NEXT TRANSMISSION AVAILABLE IN",
    footerLeft: "JUST AN IDEA IS ENOUGH",
    footerRight: "NEXT CHAPTER · MAYBE YOURS",
    copy: "Copy ",
    copied: "Copied ",
  },

  // SpaceDefender
  spaceDefender: {
    eyebrow: "EXPERIMENT / 06",
    meta: "PILOT SYSTEM · S/F/Y",
    titleFirst: "SPACE",
    titleSecond: "DEFENDER.",
    introduction:
      "This face fights back. Move to engage; weapons are automatic.",
    targetPrefix: "LIVE TARGET / WAVE ",
    field: "01 — DESTRUCTIBLE FIELD",
    system: "SYSTEM ",
    paused: "PAUSED",
    engaged: "ENGAGED",
    ready: "READY",
    mouseTouch: "MOUSE / TOUCH",
    moveToEngage: "MOVE TO ENGAGE",
    autoFire: "AUTO FIRE",
    hits: "HITS",
    canvasLabel:
      "Space Defender play field: move your mouse or drag a finger to move and fire",
  },

  // Shared navigation, splash, and small reusable UI labels.
  navigation: {
    home: "HOME",
    projects: "PROJECTS",
    forge: "FORGE",
    blog: "BLOG",
    contact: "CONTACT",
    spaceDefender: "SPACEDEFENDER",
    cubeLabel: "Portfolio screens",
    verticalLabel: "Portfolio sections",
    sectionLabels: {
      home: "Home",
      projects: "Projects",
      forge: "Forge",
      blog: "Blog",
      contact: "Contact",
      spaceDefender: "Space Defender",
    },
  },
  splash: { titleSuffix: " / DIGITAL PORTFOLIO", loading: "LOADING" },
  social: {
    ariaLabel: "Social media links",
    heading: "FIND ME ONLINE",
    comingSoonSuffix: " link coming soon",
  },
  githubActivity: {
    ariaLabel: "GitHub contribution activity",
    totalCount: "{{count}} contributions in the last year",
    less: "None",
    more: "More",
  },
  currentlyBuilding: { heading: "Currently Working" },
  greeting: {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
  },
  companyLogoAlt: "Company logo",
} as const;
