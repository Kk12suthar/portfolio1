/* Everything this page says lives here. */

export type Mode = 'rage' | 'calm';

/** Where "back to the film" goes. Locally that is the KiX dev server. */
export const FILM_URL: string = import.meta.env.VITE_FILM_URL || '/';

export const site = {
  title: 'Kishor Kumar · AI Engineer',
  description:
    'Kishor Kumar Suthar, AI engineer at Accenture. Multi-agent systems and LLM pipelines in production.',
};

export const hero = {
  lead: 'AI engineer at Accenture. I build multi-agent systems and LLM pipelines.',
};

export const voiceOver = [
  'I am an AI engineer at Accenture. I own and maintain the LLM and VLM systems behind a set of enterprise workflow tools.',
  'For two years most of my work has been taking models that look good in a notebook and keeping them reliable once real people use them.',
  'Outside work I am building Transformer, a multi-agent platform that cleans and reshapes spreadsheets from plain English instructions.',
];

export interface Metric {
  label: string;
  from?: string;
  to: string;
  /** bar lengths, 0..1 */
  a?: number;
  b: number;
}

export interface Role {
  id: 'generate' | 'detect';
  index: string;
  title: string;
  when: string;
  fig: string;
  beats: string[];
  metrics: Metric[];
  tags: string[];
}

export const work = {
  title: ['First I taught a model', 'to read the diagram.', 'Then one to write it.'],
  lead: 'Two roles at Accenture, both on BPMN process diagrams. Drawing one by hand took a person twenty to thirty minutes.',
  roles: [
    {
      id: 'generate',
      index: '02',
      title: 'Full Stack LLM Development Analyst',
      when: 'Sep 2025 — now',
      fig: 'A sentence becomes a process',
      beats: [
        'Led the move from a computer vision pipeline to a full LLM and VLM architecture on GPT-4 and Gemini.',
        'Pushed accuracy on complex workflows from 65–70% to 85%, and on standard flows to 99%.',
        'Fine-tuned open-source LLMs through HuggingFace and Ollama with LoRA and PEFT for domain-specific tasks.',
      ],
      metrics: [
        { label: 'Complex workflows', from: '65–70%', to: '85%', a: 0.675, b: 0.85 },
        { label: 'Standard flows', to: '99%', b: 0.99 },
        { label: 'One BPMN diagram', from: '20–30 min', to: 'under 60 s', a: 1, b: 0.04 },
      ],
      tags: ['GPT-4', 'Gemini', 'FastAPI', 'HuggingFace', 'Ollama', 'LoRA', 'PEFT'],
    },
    {
      id: 'detect',
      index: '01',
      title: 'Associate Software Engineer, AI/ML',
      when: 'Feb 2024 — Aug 2025',
      fig: 'YOLOv9 reads a hand-made diagram',
      beats: [
        'Built a YOLOv9 pipeline that finds BPMN elements in diagrams at 98% accuracy on proprietary datasets.',
        'Combined OCR for the text with custom spatial algorithms that rebuild sequence flows and fill in missing BPMN standards.',
        'The work was recognised by leadership.',
      ],
      metrics: [
        { label: 'Element detection', to: '98%', b: 0.98 },
        { label: 'One BPMN diagram', from: '20–30 min', to: 'under 60 s', a: 1, b: 0.04 },
      ],
      tags: ['YOLOv9', 'OCR', 'OpenCV', 'FastAPI', 'Python'],
    },
  ] as Role[],
};

export const transformer = {
  name: 'Transformer',
  tagline: ['Plain English in.', 'Clean tables out.'],
  lead: 'A multi-agent platform that takes raw CSV and Excel files and changes them from plain English instructions. Agents built on Google ADK parse, clean and reshape the data through an MCP tool with role-based database access. Jobs that took thirty to sixty minutes by hand finish in seconds.',
  live: 'https://transformer-blue.vercel.app',
  code: 'https://github.com/Kk12suthar',
  tags: ['Python', 'FastAPI', 'Google ADK', 'MCP', 'React', 'TypeScript', 'PostgreSQL', 'OpenTelemetry', 'Langfuse', 'GitHub Actions'],
  video: '/about/videos/projects-transformer-video.mp4',
};

export const stack = {
  title: ['What I', 'work with.'],
  groups: [
    {
      name: 'Agentic AI',
      items: [
        { what: 'Multi-agent orchestration', with: 'LangGraph, CrewAI, AutoGen', yrs: '2+ yrs' },
        { what: 'LLM APIs and prompting', with: 'GPT-4, Gemini', yrs: '2.5 yrs' },
        { what: 'RAG and vector stores', with: 'Pinecone, pgvector', yrs: '2 yrs' },
        { what: 'Tool use and MCP servers', with: 'Google ADK, MCP', yrs: '1.5 yrs' },
        { what: 'Fine-tuning', with: 'LoRA, PEFT, HuggingFace, Ollama', yrs: '1.5 yrs' },
      ],
    },
    {
      name: 'Backend',
      items: [
        { what: 'Python services', with: 'FastAPI, Flask, Django', yrs: '3+ yrs' },
        { what: 'Data', with: 'PostgreSQL, Redis, MongoDB', yrs: '2+ yrs' },
        { what: 'APIs and microservices', with: 'REST, async workers', yrs: '2+ yrs' },
        { what: 'Queues', with: 'Celery, RabbitMQ', yrs: '1.5 yrs' },
        { what: 'Observability', with: 'OpenTelemetry, Langfuse, Datadog', yrs: '2 yrs' },
      ],
    },
    {
      name: 'Vision',
      items: [
        { what: 'Object detection', with: 'YOLOv9', yrs: '1.5 yrs' },
        { what: 'Reading documents', with: 'OCR, OpenCV', yrs: '1.5 yrs' },
        { what: 'Vision-language models', with: 'GPT-4, Gemini', yrs: '1 yr' },
      ],
    },
    {
      name: 'Frontend',
      items: [
        { what: 'Interfaces', with: 'React, Next.js', yrs: '2+ yrs' },
        { what: 'Language', with: 'TypeScript, modern JavaScript', yrs: '2.5 yrs' },
        { what: 'Styling', with: 'Tailwind, modern CSS layout', yrs: '3 yrs' },
        { what: 'Motion', with: 'GSAP', yrs: '1.5 yrs' },
      ],
    },
    {
      name: 'Cloud and DevOps',
      items: [
        { what: 'Containers', with: 'Docker', yrs: '2.5 yrs' },
        { what: 'CI/CD', with: 'GitHub Actions, GitLab CI', yrs: '2 yrs' },
        { what: 'Cloud', with: 'AWS, GCP, Vercel', yrs: '1.5 yrs' },
        { what: 'Serverless and edge', with: 'Functions, edge runtimes', yrs: '1 yr' },
      ],
    },
  ],
};

export const numbers = {
  stats: [
    { value: 98, suffix: '%', label: 'YOLOv9 detection accuracy on proprietary BPMN datasets' },
    { value: 99, suffix: '%', label: 'LLM pipeline accuracy on standard enterprise workflows' },
    { value: 85, suffix: '%', label: 'accuracy on complex workflows after the GenAI migration' },
    { value: 60, suffix: ' s', label: 'to make a BPMN diagram, down from 20–30 minutes' },
    { value: 2, suffix: ' yrs', label: 'of agentic AI in production' },
    { value: 200, suffix: '+', label: 'DSA problems solved' },
  ],
};

export const contact = {
  title: ["Let's build", 'something.'],
  lead: 'Open to full-time roles and collaborations, especially on agentic systems.',
  email: 'sutharkishor82@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kishor-kumar-a69946226/' },
    { label: 'GitHub', href: 'https://github.com/Kk12suthar' },
  ],
};
