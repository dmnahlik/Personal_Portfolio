/* =========================================================
   PORTFOLIO CONTENT: edit this file to change the site.
   Types below are checked at build time, so a typo in a field
   name or a missing required value fails `npm run build`.
   ========================================================= */

export type Profile = {
  name: string;
  initials: string;
  greeting: string;
  title: string;
  intro: string;
  photo: string; // path under public/, e.g. "/assets/img/headshot.jpg"
};

export type ShowcaseItem = {
  type: "project" | "award";
  title: string;
  date?: string;
  description: string;
  tags?: string[];
  image?: string; // path under public/ (placeholder used if empty)
  imagePosition?: string; // crop anchor in the 16:9 frame, e.g. "left center", "50% 20%"
  links?: { label: string; url: string }[];
};

/** A skill shown with a bar (`level` 0–100), or a plain string shown as a chip. */
export type Skill = { name: string; level: number } | string;

export type SkillGroup = {
  category: string;
  icon?: string;
  description?: string; // optional paragraph; leave `items` empty to show only this
  items: Skill[];
};

export type IconName = "github" | "linkedin" | "email" | "phone" | "location" | "link";

export type Contact = {
  email?: string;
  phone?: string; // shown as a tap-to-call link
  location?: string;
  links: { label: string; url: string; icon: IconName }[];
};

export type Portfolio = {
  profile: Profile;
  sections: { projectsSubtitle: string; skillsSubtitle: string; contactSubtitle: string };
  showcase: ShowcaseItem[];
  skills: SkillGroup[];
  contact: Contact;
};

export const portfolio: Portfolio = {
  /* ---------- 1. Home / Landing ---------- */
  profile: {
    name: "David Nahlik",
    initials: "DN",
    greeting: "Hello, I am",
    title: "CAPA Team Lead",
    intro:
      "Hardworking Quality Leader with a focus in continuous improvement and Lean Six Sigma. With over a decade of experience in pharmaceutical and aerospace manufacturing, I have worked hundreds of corrective actions and Lean projects that have reduced cost and waste for the various companies I have worked for.",
    photo: "/assets/img/headshot.jpg",
  },

  /* Section subtitles */
  sections: {
    projectsSubtitle:
      "I have worked on dozens of special projects during my career. Below are a few highlighted projects and recent recognition.",
    skillsSubtitle:
      "Skilled in Quality Management System and Document Review & Publication as well as in tools like MS Office and AI tools.",
    contactSubtitle: "Please reach out and contact me if you have any questions regarding my work.",
  },

  /* ---------- 2. Projects / Awards Showcase ---------- */
  showcase: [
    {
      type: "project",
      title: "Biopharmaceutical Perfusion Tiger Team",
      date: "2022",
      description:
        "Led a team of cross-functional leaders to eliminate priority issues causing production shutdowns.",
      image: "/assets/img/biopharma_perfusion.jpg",
    },
    {
      type: "project",
      title: "Deploy Augmented Reality Headsets for Training",
      date: "2020",
      description:
        "Wrote augmented reality training programs using Microsoft HoloLens for training, general production use, and virtual client interactions.",
      image: "/assets/img/ar_headset_training.jpg",
    },
    {
      type: "award",
      title: "Boeing Gold Recognition",
      date: "2026",
      description: "Recognized by leadership for outstanding work and exemplifying the company values.",
      tags: ["Award"],
      image: "/assets/img/boeing_gold_recognition.jpg",
    },
  ],

  /* ---------- 3. Skills ---------- */
  skills: [
    {
      category: "Quality Management System",
      icon: "📋",
      items: [
        { name: "SQL Coding", level: 90 },
        { name: "Data Projection", level: 95 },
        { name: "Python Coding", level: 75 },
      ],
    },
    {
      category: "Document Review & Publication",
      icon: "🖥️",
      description:
        "Gather relevant information from process SMEs, facilitate review sessions, cross-reference linked documents, and code and push document updates through relevant systems.",
      items: [],
    },
    {
      category: "Tools",
      icon: "🛠️",
      items: ["MS Office", "Claude AI", "RCCA", "Git"],
    },
  ],

  /* ---------- 4. Contact (empty values are hidden) ---------- */
  contact: {
    email: "dmnahlik@gmail.com",
    phone: "(314) 974-1178",
    location: "Arnold, Missouri",
    links: [
      { label: "GitHub", url: "https://github.com/dmnahlik", icon: "github" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/dnahlik/", icon: "linkedin" },
    ],
  },
};
