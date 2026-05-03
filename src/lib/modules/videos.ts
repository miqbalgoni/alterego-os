// Central video catalog. Curated video resources cited in the source PDF
// ("Content Modules.pdf" / HIVE), keyed by both moduleId and sectionId.
//
// Used by:
//   - SectionForm.tsx — shows section-level videos alongside the assessment
//   - Lesson player — surfaces module-level videos on the relevant beat
//
// Keep this file the SINGLE source of truth for all video links.

export type VideoSource = "YouTube" | "Vimeo" | "Web";

export interface VideoResource {
  url: string;
  title: string;
  source: VideoSource;
  // Short context line — why this video is worth watching
  why: string;
  // Optional duration string (e.g. "12 min") for UI display
  duration?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getVideoEmbedUrl(v: VideoResource): string | null {
  // YouTube watch links → embed form
  const yt = v.url.match(/[?&]v=([^&]+)/) || v.url.match(/youtu\.be\/([^?&]+)/);
  if (v.source === "YouTube" && yt) {
    return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  }
  // Vimeo links: vimeo.com/{id} or vimeo.com/{id}/{hash}
  const vm = v.url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (v.source === "Vimeo" && vm) {
    const id = vm[1];
    const hash = vm[2];
    return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`;
  }
  return null;
}

export function getVideoThumbnail(v: VideoResource): string | null {
  const yt = v.url.match(/[?&]v=([^&]+)/) || v.url.match(/youtu\.be\/([^?&]+)/);
  if (v.source === "YouTube" && yt) {
    return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Per-module video registry (cited in module body content)
// ---------------------------------------------------------------------------

export const MODULE_VIDEOS: Record<string, VideoResource[]> = {
  "m1-what-is-startup": [
    {
      url: "https://www.youtube.com/watch?v=afCWe1FeHxI",
      title: "What is a startup? — Bocconi University",
      source: "YouTube",
      why: "Academic framing of the startup definition, scalability, and life stages.",
    },
  ],
  "m5-company-system": [
    {
      url: "https://vimeo.com/684914163/a590d531d5",
      title: "Il Sistema Azienda — Online Academy",
      source: "Vimeo",
      why: "Walkthrough of how a company functions as a system of resources and stakeholders.",
    },
  ],
  "m22-startup-tools": [
    {
      url: "https://www.youtube.com/watch?v=VmZr6u4qWp0",
      title: "Startup tooling walkthrough",
      source: "YouTube",
      why: "Practical tour of recommended tools across functions.",
    },
    {
      url: "https://www.toolperstartup.com/",
      title: "Tool per Startup — directory",
      source: "Web",
      why: "Curated directory of software tools by use case.",
    },
  ],
  "m23-project-management": [
    {
      url: "https://www.youtube.com/watch?v=5RocT_OdQcA",
      title: "Agile project management — Scrum basics",
      source: "YouTube",
      why: "Concise intro to Scrum ceremonies and sprint mechanics.",
    },
    {
      url: "https://www.youtube.com/watch?v=bw-NvGvLHtM",
      title: "Kanban for small teams",
      source: "YouTube",
      why: "How to set up a lightweight Kanban for a 2–3 person team.",
    },
  ],
  "m35-financial-model": [
    {
      url: "https://www.youtube.com/watch?v=LBC16jhiwak",
      title: "Y Combinator — Building a Financial Model",
      source: "YouTube",
      why: "YC's pragmatic take on what an early-stage forecast actually needs.",
    },
  ],
  "m36-scalability": [
    {
      url: "https://www.youtube.com/watch?v=6lY9CYIY4pQ",
      title: "Y Combinator — How to scale a startup",
      source: "YouTube",
      why: "When and how to start scaling without breaking the company.",
    },
  ],
  "m39-business-plan": [
    {
      url: "https://www.youtube.com/watch?v=zlrb_X6fYZ0",
      title: "Business plan for startups",
      source: "YouTube",
      why: "Walkthrough of the structure and reasoning behind a startup business plan.",
    },
  ],
  "m46-pitch": [
    {
      url: "https://www.youtube.com/watch?v=3zKsRzoeHrs",
      title: "How a 4-minute pitch should look",
      source: "YouTube",
      why: "Reference example of pacing, structure, and call-to-action in a live pitch.",
    },
    {
      url: "https://slidebean.com/pitch-deck-examples",
      title: "Slidebean — Pitch deck examples gallery",
      source: "Web",
      why: "Real pitch decks from funded startups, broken down slide by slide.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Per-section video registry (shown alongside the questionnaire)
// ---------------------------------------------------------------------------

export const SECTION_VIDEOS: Record<string, VideoResource[]> = {
  "irl-0": [
    {
      url: "https://www.youtube.com/watch?v=afCWe1FeHxI",
      title: "What is a startup? — Bocconi University",
      source: "YouTube",
      why: "Foundation: what really makes a startup different from a small business.",
    },
    {
      url: "https://vimeo.com/684914163/a590d531d5",
      title: "Il Sistema Azienda — Online Academy",
      source: "Vimeo",
      why: "How a company works as a system: stakeholders, accounts, decisions.",
    },
  ],
  "irl-1": [],
  "irl-2": [],
  "irl-3": [
    {
      url: "https://www.youtube.com/watch?v=5RocT_OdQcA",
      title: "Agile project management — Scrum basics",
      source: "YouTube",
      why: "Useful framing for running validation sprints during this phase.",
    },
  ],
  "irl-4": [],
  "irl-5": [],
  "irl-6": [
    {
      url: "https://www.youtube.com/watch?v=LBC16jhiwak",
      title: "Y Combinator — Building a Financial Model",
      source: "YouTube",
      why: "Reference for the kind of model you should be able to articulate at IRL 6.",
    },
    {
      url: "https://www.youtube.com/watch?v=zlrb_X6fYZ0",
      title: "Business plan for startups",
      source: "YouTube",
      why: "How investors expect a business plan to be structured.",
    },
  ],
  "irl-7": [
    {
      url: "https://www.youtube.com/watch?v=6lY9CYIY4pQ",
      title: "Y Combinator — How to scale a startup",
      source: "YouTube",
      why: "Scalability checks investors look for at the high-fidelity prototype stage.",
    },
  ],
  "irl-8": [
    {
      url: "https://www.youtube.com/watch?v=3zKsRzoeHrs",
      title: "How a 4-minute pitch should look",
      source: "YouTube",
      why: "When operations matter, your pitch needs to translate them to outsiders.",
    },
    {
      url: "https://slidebean.com/pitch-deck-examples",
      title: "Slidebean — Pitch deck examples",
      source: "Web",
      why: "Decks from operating startups — useful templates for IRL 8.",
    },
  ],
  "irl-9": [],
};

export function getModuleVideos(moduleId: string): VideoResource[] {
  return MODULE_VIDEOS[moduleId] ?? [];
}

export function getSectionVideos(sectionId: string): VideoResource[] {
  return SECTION_VIDEOS[sectionId] ?? [];
}
