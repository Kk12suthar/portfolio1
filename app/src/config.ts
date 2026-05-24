export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  href: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  eyebrow: string
  titleLines: string[]
  leadText: string
  supportingNotes: string[]
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  socialLinks: { label: string; href: string }[]
}

export interface ManifestoConfig {
  videoPath: string
  text: string
  sectionLabel: string
}

export interface StatItem {
  number: string
  label: string
}

export interface AboutConfig {
  stats: StatItem[]
}

export interface ExperienceCard {
  name: string
  subtitle: string
  status: string
  description: string
  tags: string[]
  ctas?: { label: string; href: string }[]
  image: string
  slug: string
}

export interface ExperienceConfig {
  sectionLabel: string
  items: ExperienceCard[]
}

export interface ObservationConfig {
  sectionLabel: string
  videoPath: string
  statusText: string
  overlayText: string
}

export interface ArchiveItem {
  src: string
  label: string
}

export interface ArchivesConfig {
  sectionLabel: string
  vaultTitle: string
  closeText: string
  items: ArchiveItem[]
}

export interface AchievementStat {
  value: string
  label: string
}

export interface AchievementText {
  text: string
}

export interface AchievementsConfig {
  sectionLabel: string
  stats: AchievementStat[]
  textAchievements: AchievementText[]
}

export interface ContactConfig {
  heading: string
  subtext: string
  email: string
  linkedin: string
  github: string
  socialLinks: { label: string; href: string }[]
}

export interface FooterConfig {
  copyrightText: string
  statusText: string
}

export const siteConfig: SiteConfig = {
  language: 'en',
  siteTitle: 'Kishor Kumar | AI Engineer & Agentic Systems Builder',
  siteDescription: 'Portfolio of Kishor Kumar, an AI Engineer building production multi-agent systems and LLM pipelines at Accenture.',
}

export const navigationConfig: NavigationConfig = {
  brandName: 'KISHOR',
  links: [
    { label: 'ABOUT', href: '#about' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'SKILLS', href: '#skills' },
  ],
}

export const heroConfig: HeroConfig = {
  eyebrow: 'AI ENGINEER & AGENTIC SYSTEMS BUILDER',
  titleLines: ['KISHOR', 'KUMAR'],
  leadText: 'I build multi-agent systems and LLM pipelines that run in production, not just in demos.',
  supportingNotes: [
    'Full Stack LLM Development Analyst at Accenture.',
    'Production agentic AI. Real results.',
    'Currently building Transformer, an autonomous multi-agent data transformation platform.',
  ],
  ctaPrimary: { label: 'VIEW MY WORK', href: '#projects' },
  ctaSecondary: { label: 'GET IN TOUCH', href: '#contact' },
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/Kk12suthar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kishor-kumar-a69946226/' },
    { label: 'Email', href: 'mailto:sutharkishor82@gmail.com' },
  ],
}

export const manifestoConfig: ManifestoConfig = {
  videoPath: '/about/videos/about-section-video.mp4',
  text: 'I am an AI engineer currently at Accenture where I own and maintain production LLM and VLM systems that automate complex enterprise workflows. I have spent the last two years in the gap between what AI can do in a notebook and what it takes to make it reliable in production. That gap is where I find the most interesting problems. Outside of work I build things independently because I genuinely enjoy it, not to pad a resume. My current project Transformer is a live multi-agent data transformation platform that eliminates the need for Excel skills or coding knowledge for structured data workflows entirely.',
  sectionLabel: 'WHO I AM',
}

export const aboutConfig: AboutConfig = {
  stats: [
    { number: '2+', label: 'YEARS PRODUCTION AI' },
    { number: '99%', label: 'ACCURACY ON STANDARD FLOWS' },
    { number: '1', label: 'LIVE AGENTIC PLATFORM DEPLOYED' },
  ],
}

export const experienceConfig: ExperienceConfig = {
  sectionLabel: 'WHERE I HAVE WORKED',
  items: [
    {
      slug: 'accenture-llm',
      name: 'ACCENTURE',
      subtitle: 'FULL STACK LLM DEVELOPMENT ANALYST',
      status: 'SEP 2025 · PRESENT',
      description: 'Led migration from computer vision pipeline to full LLM/VLM architecture using GPT-4 and Gemini. Pushed complex workflow accuracy from 65-70% to 85% and standard flows to 99%. Reduced BPMN diagram creation from 20-30 minutes to under 60 seconds. Fine-tuned open-source LLMs via HuggingFace and Ollama with LoRA and PEFT for domain-specific tasks.',
      tags: ['GPT-4', 'Gemini', 'FastAPI', 'HuggingFace', 'Ollama', 'LoRA', 'PEFT'],
      image: '/about/images/experience-accenture-1.jpg',
    },
    {
      slug: 'accenture-ml',
      name: 'ACCENTURE',
      subtitle: 'ASSOCIATE SOFTWARE ENGINEER AI/ML',
      status: 'FEB 2024 · AUG 2025',
      description: 'Built YOLOv9 pipeline for BPMN element detection achieving 98% accuracy. Combined OCR for text extraction and custom spatial algorithms to reconstruct sequence flows and auto-fill missing BPMN standards. Work recognised by leadership. Reduced manual diagram creation from 20-30 minutes to under 60 seconds.',
      tags: ['YOLOv9', 'OCR', 'OpenCV', 'FastAPI', 'Python'],
      image: '/about/images/experience-accenture-2.jpg',
    },
  ],
}

export const transformerProject = {
  name: 'TRANSFORMER',
  subtitle: 'AUTONOMOUS MULTI-AGENT DATA TRANSFORMATION PLATFORM',
  status: 'LIVE',
  description: 'A production multi-agent platform that takes raw CSV and Excel files and transforms them through plain English instructions. No SQL knowledge, no Excel skills, no coding required. Agents built on Google ADK handle parsing, cleaning, and transformation autonomously through a secure MCP tool with role-based database access. What previously took 30 to 60 minutes of manual work happens in seconds.',
  tags: ['Python', 'FastAPI', 'Google ADK', 'MCP', 'React', 'TypeScript', 'PostgreSQL', 'OpenTelemetry', 'Langfuse', 'GitHub Actions'],
  ctas: [
    { label: 'LIVE DEMO →', href: 'https://transformer-blue.vercel.app' },
    { label: 'VIEW CODE →', href: 'https://github.com' },
  ],
  image: '/about/images/experience-transformer.png',
}

export const observationConfig: ObservationConfig = {
  sectionLabel: 'TRANSFORMER · LIVE',
  videoPath: '/about/videos/projects-transformer-video.mp4',
  statusText: 'PLATFORM STATUS: ACTIVE',
  overlayText: 'TRANSFORMED 1,247 FILES TODAY',
}

export const archivesConfig: ArchivesConfig = {
  sectionLabel: 'WHAT I WORK WITH',
  vaultTitle: 'VIEW ALL SKILLS',
  closeText: 'CLOSE',
  items: [
    { src: '/about/images/skill-backend.png', label: 'CORE BACKEND' },
    { src: '/about/images/skill-agentic.png', label: 'AGENTIC AI' },
    { src: '/about/images/skill-frontend.png', label: 'FRONTEND' },
    { src: '/about/images/skill-devops.png', label: 'CLOUD & DEVOPS' },
  ],
}

export const achievementsConfig: AchievementsConfig = {
  sectionLabel: 'BY THE NUMBERS',
  stats: [
    { value: '98%', label: 'YOLOv9 DETECTION ACCURACY ON PROPRIETARY BPMN DATASETS' },
    { value: '99%', label: 'LLM PIPELINE ACCURACY ON STANDARD ENTERPRISE WORKFLOWS' },
    { value: '85%', label: 'ACCURACY ON COMPLEX WORKFLOWS AFTER GENAI MIGRATION' },
    { value: '60 SEC', label: 'BPMN DIAGRAM CREATION TIME, DOWN FROM 20-30 MINUTES' },
    { value: '2 YEARS', label: 'PRODUCTION AGENTIC AI EXPERIENCE' },
    { value: '200+', label: 'DSA PROBLEMS SOLVED' },
  ],
  textAchievements: [
    { text: 'GATE DA 2024 QUALIFIED' },
    { text: 'LEADERSHIP RECOGNITION AT ACCENTURE FOR BPMN AUTOMATION SYSTEM' },
  ],
}

export const contactConfig: ContactConfig = {
  heading: "LET'S BUILD SOMETHING",
  subtext: 'I am open to full-time roles, collaborations, and interesting problems. If what you are building involves agentic systems or production AI, I would love to hear about it.',
  email: 'mailto:sutharkishor82@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kishor-kumar-a69946226/',
  github: 'https://github.com/Kk12suthar',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/Kk12suthar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kishor-kumar-a69946226/' },
    { label: 'Email', href: 'mailto:sutharkishor82@gmail.com' },
  ],
}

export const footerConfig: FooterConfig = {
  copyrightText: '© 2025 KISHOR KUMAR',
  statusText: 'ALL SYSTEMS OPERATIONAL',
}
