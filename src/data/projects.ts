export type ProjectStatus = "ONLINE" | "SOURCE_AVAILABLE" | "IN_PROGRESS" | "ARCHIVED";

export interface Project {
  id: string;
  name: string;
  year: string;
  type: string;
  role: string;
  tech: string[];
  description: string;
  features: string[];
  repoUrl?: string;
  liveUrl?: string;
  /**
   * Direct-download file for this project, e.g. a raw GitHub permalink
   * ("https://raw.githubusercontent.com/OWNER/REPO/BRANCH/path/file.exe"). Browsers save it
   * because raw serves binaries as application/octet-stream. Use the /raw/ URL, never the
   * /blob/ page URL (that renders a web page, not a download).
   */
  downloadUrl?: string;
  /** Button text for the download action, e.g. "DOWNLOAD_EXE". Only used with downloadUrl. */
  downloadLabel?: string;
  /**
   * ONLINE = has a live demo (liveUrl), SOURCE_AVAILABLE = public repo only,
   * IN_PROGRESS = still being built, ARCHIVED = no longer maintained.
   */
  status: ProjectStatus;
}

export const projects: Project[] = [
  {
    id: "brainplay",
    name: "BrainPlay",
    year: "2026",
    type: "Casual learning PWA & multiplayer edge engine",
    role: "Full stack & edge systems engineer",
    tech: [
      "TypeScript",
      "Preact",
      "Cloudflare Workers",
      "Durable Objects",
      "Cloudflare D1",
      "WebSockets",
      "Playwright",
      "Vitest",
    ],
    description:
      "Zero-cost, zero-PII offline-first learning PWA with real-time multiplayer rooms powered by Cloudflare Workers and Durable Objects.",
    features: [
      "Offline-first PWA architecture with Service Worker shell and dataset caching.",
      "2–50 player real-time multiplayer rooms via Cloudflare Workers and Durable Objects WebSockets.",
      "Cloudflare D1 SQLite database for room token verification and rate limiting.",
      "Over 4,000 curated flashcards across context phrases (EN/KO/JA) and trivia tracks.",
      "Build-time romanization pipelines (Revised Romanization & Hepburn Romaji).",
      "Local spaced-repetition solo practice and daily challenge modes.",
      "Comprehensive automated test suite spanning unit, worker, and Playwright E2E tests.",
    ],
    repoUrl: "https://github.com/yatoyataro/brainplay",
    liveUrl: "https://prb005-brainplay.pages.dev",
    status: "ONLINE",
  },
  {
    id: "cashback-detective-v1",
    name: "Cashback Detective v1",
    year: "2026",
    type: "AI-assisted cashback investigation platform",
    role: "Backend & systems engineer",
    tech: [
      "Node.js",
      "TypeScript",
      "Express 5",
      "Vue 3",
      "PostgreSQL",
      "Neon",
      "Docker",
      "Vitest",
      "Zod",
    ],
    description:
      "Full-stack financial transaction investigation platform with Express 5, Neon serverless PostgreSQL, AI policy reasoning, and strict security controls.",
    features: [
      "REST API built with Express 5, Node.js 22, and TypeScript.",
      "Serverless PostgreSQL database integration using Neon.",
      "AI-assisted investigation chat for cashback dispute policies.",
      "Production-grade security: JWT authentication, CSRF protection, Helmet headers, and rate limiting.",
      "Input validation and schema enforcement with Zod.",
      "Structured logging with Pino and Dockerized deployment workflows.",
      "Automated test coverage with Vitest and Supertest.",
    ],
    repoUrl: "https://github.com/yatoyataro/cashback-detective-v1",
    liveUrl: "https://cashback-detective-v1.vercel.app",
    status: "ONLINE",
  },
  {
    id: "calamansee",
    name: "Calamansee",
    year: "2025",
    type: "Android mobile app & on-device ML (Thesis)",
    role: "Core mobile & systems developer",
    tech: [
      "Kotlin",
      "Android SDK",
      "CameraX",
      "TensorFlow Lite",
      "YOLOv11",
      "Room DB",
      "Material Design",
    ],
    description:
      "BS Computer Science capstone thesis mobile application for offline real-time detection and classification of citrus calamansi plant diseases using on-device YOLOv11.",
    features: [
      "Academic thesis capstone project at Pampanga State University.",
      "On-device neural network inference with YOLOv11 and TensorFlow Lite (GPU delegate).",
      "Custom hardware camera pipeline using Android CameraX.",
      "Custom canvas threshold overlay with corner brackets and leaf-positioning guidelines.",
      "Offline diagnostics history and record persistence with Android Room SQLite DB.",
      "Comprehensive disease encyclopedia covering Citrus Canker, Greening, Leaf Miner, and molds.",
      "Actionable treatment recommendations, prevention guides, and source credibility verifications.",
    ],
    repoUrl: "https://github.com/knneff/Calamansee",
    status: "SOURCE_AVAILABLE",
  },
  {
    id: "my-honorian-buddy",
    name: "My Honorian Buddy",
    year: "2025",
    type: "Peer tutoring & academic matchmaking platform",
    role: "Backend engineer",
    tech: ["Laravel", "PHP", "MySQL", "Blade", "Tailwind CSS", "JavaScript", "Python"],
    description:
      "Institutional peer tutoring platform supporting tutor matching, session scheduling, academic progress tracking, and real-time collaboration.",
    features: [
      "Content-based AI matchmaking algorithm implemented in Python.",
      "Session scheduling, milestone management, and progress tracking.",
      "Real-time chat and collaborative workspace for students and tutors.",
      "Role-based access control and student identity verification.",
      "Automated Certificate of Registration (COR) validation workflows.",
    ],
    repoUrl: "https://github.com/yatoyataro/My-Honorian-Buddy",
    status: "SOURCE_AVAILABLE",
  },
  {
    id: "universal-image-converter",
    name: "Universal Image Converter",
    year: "2026",
    type: "Windows desktop batch processing utility",
    role: "Software engineer",
    tech: ["Python", "CustomTkinter", "Pillow", "PyInstaller", "ThreadPoolExecutor"],
    description:
      "Multi-threaded Windows desktop application for high-performance batch image format conversions with customizable output presets.",
    features: [
      "Batch-select PNG, JPG, JPEG, WebP, and BMP files or drag-and-drop from Explorer.",
      "Concurrent multi-threaded conversion engine with live progress tracking and cancellation.",
      "Quality slider, lossless WebP encoding, max-dimension resizing, and EXIF preservation.",
      "Collision-safe overwrite policies with automatic incremental file naming.",
      "Dark and light themes with state persistence in Windows %APPDATA%.",
      "Compiled standalone Windows executable distributed directly via GitHub.",
    ],
    repoUrl: "https://github.com/yatoyataro/universal_image_converter",
    downloadUrl:
      "https://raw.githubusercontent.com/yatoyataro/universal_image_converter/main/dist/Universal_image_converter.exe",
    downloadLabel: "DOWNLOAD_EXE",
    status: "SOURCE_AVAILABLE",
  },
  {
    id: "researchlify",
    name: "Researchlify",
    year: "2026",
    type: "Autonomous multi-agent discovery architecture",
    role: "Systems & agentic architect",
    tech: [
      "Python",
      "Shell",
      "Multi-Agent Systems",
      "Knowledge Graphs",
      "Graphify",
      "Markdown Schemas",
    ],
    description:
      "Cross-IDE multi-agent orchestration framework coordinating 13 autonomous roles for software discovery, technical planning, and quality audits.",
    features: [
      "Sequential 13-agent orchestration pipeline covering research, problem analysis, and UX.",
      "Deterministic knowledge graph generation and state verification with Graphify.",
      "Cross-IDE governance bridging Antigravity workflows and Claude Code command hooks.",
      "Structured dual-package handoffs: technical specs and executive summaries.",
      "Automated repository state validation scripts and evidence ledgers.",
    ],
    repoUrl: "https://github.com/yatoyataro/Researchlify",
    status: "SOURCE_AVAILABLE",
  },
  {
    id: "larahbigdeck",
    name: "LarahBigDeck",
    year: "2025",
    type: "Flashcard learning application",
    role: "Full stack engineer",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Supabase", "PostgreSQL"],
    description:
      "Modern flashcard-based study application with cloud synchronization, custom deck authoring, public deck sharing, and study sessions.",
    features: [
      "Interactive flashcard deck authoring and study review engine.",
      "Public deck sharing with idempotent PostgreSQL Row-Level Security (RLS) policies.",
      "Supabase PostgreSQL integration and schema migration scripts.",
      "Responsive UI built with React 19, Tailwind CSS, and shadcn/ui primitives.",
      "Client-side study state and performance optimization via Vite.",
    ],
    repoUrl: "https://github.com/yatoyataro/LarahBigDeck",
    liveUrl: "https://larah-big-deck.vercel.app",
    status: "ONLINE",
  },
];
