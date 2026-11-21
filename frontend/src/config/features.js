// frontend/src/config/features.js
/**
 * NextPath.ai — Scalable Feature Registry
 * 
 * Adding a new feature to the platform:
 * 1. Create your page component in `src/pages/<YourFeature>.js`
 * 2. Add a new object entry to the FEATURES array below
 * 3. Mount the route in `src/App.js`
 * 
 * The Home dashboard, feature showcase, and navigation automatically read from this registry.
 */

export const FEATURES = [
  {
    id: "chat",
    title: "AI Career Advisor",
    tagline: "24/7 Intelligent Career & Technical Mentor",
    shortDesc: "Get instant career guidance, interview simulations, and actionable answers powered by Gemini AI.",
    fullDesc:
      "Harness the power of Gemini Flash AI for personalized career guidance. Receive real-time strategies, skill recommendations, career pivots, and technical advice tailored to your goals.",
    path: "/chat",
    img: "/assets/chatbot.jpg",
    category: "AI Mentorship",
    badge: "AI Core",
    badgeColor: "#00FF7F",
    enabled: true,
  },
  {
    id: "career-path",
    title: "AI Job Requirement Advisor",
    tagline: "Skill Gap & Strategic Career Roadmap",
    shortDesc: "Analyze your existing skills and career aspirations to formulate a step-by-step roadmap and missing competencies.",
    fullDesc:
      "Identify exactly what skills and certifications you need for your dream job. Generates personalized roadmap recommendations, course links, project ideas, and downloadable reports.",
    path: "/career-path",
    img: "/assets/path.jpg",
    category: "Career Roadmap",
    badge: "Strategic",
    badgeColor: "#38bdf8",
    enabled: true,
  },
  {
    id: "interview",
    title: "AI Skill & IQ Arena",
    tagline: "Gamified Adaptive Technical Testing",
    shortDesc: "Challenge your intellect with adaptive AI-generated questions across DSA, Logic, and Error Finding.",
    fullDesc:
      "Compete against yourself or calibrate your technical thinking with dynamically generated multiple-choice challenges. Features difficulty ranges from Easy to Expert with instant explanatory feedback.",
    path: "/interview",
    img: "/assets/interview.jpg",
    category: "Assessment",
    badge: "Gamified",
    badgeColor: "#f59e0b",
    enabled: true,
  },
  {
    id: "news",
    title: "Daily Tech Pulse",
    tagline: "Curated AI & Developer Intelligence",
    shortDesc: "Stay ahead with real-time AI-summarized tech trends, developer tooling updates, and industry news.",
    fullDesc:
      "Real-time tech and AI news curated from global feeds and summarized by Gemini. Filter by query, explore trending developments, and refresh for breaking tech updates.",
    path: "/news",
    img: "/assets/technews.jpg",
    category: "Intelligence",
    badge: "Live Feed",
    badgeColor: "#a855f7",
    enabled: true,
  },
  {
    id: "community",
    title: "Open-Source Community Hub",
    tagline: "Connect, Collaborate, & Build Together",
    shortDesc: "Connect with peers, showcase your tech stack and projects, and collaborate with developers globally.",
    fullDesc:
      "An open-source developer directory where builders share their portfolios, GitHub projects, education, and career interests to foster cross-pollination and mentorship.",
    path: "/community",
    img: "/assets/feed.jpg",
    category: "Network",
    badge: "Open Source",
    badgeColor: "#ec4899",
    enabled: true,
  },
];

export const getEnabledFeatures = () => FEATURES.filter((f) => f.enabled);

export const getFeatureById = (id) => FEATURES.find((f) => f.id === id);

export default FEATURES;
