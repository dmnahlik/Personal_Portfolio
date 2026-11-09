/* =========================================================
   PORTFOLIO CONTENT: edit this file to fill in the site.
   Every placeholder is marked "TODO". You shouldn't need to
   touch the HTML to add or remove projects, awards, or skills.
   ========================================================= */

window.PORTFOLIO = {
  /* ---------- 1. Home / Landing ---------- */
  profile: {
    name: "David Nahlik",                       // TODO: confirm display name
    initials: "DN",
    greeting: "Hello, I'm",
    title: "CAPA Team Lead",
    intro:
      "Hardworking Quality Leader with a focus in continuous improvement and Lean Six Sigma. With over a decade of experience in pharmaceutical and aerospace manufacturing, I have worked hundreds of corrective actions and Lean projects that have reduced cost and waste for the various companies I have worked for.",
    photo: "assets/img/headshot.jpg",
    resume: ""                                   // TODO: e.g. "assets/resume/David_Nahlik_Resume.pdf" (button hidden while empty)
  },

  /* Section subtitles */
  sections: {
    projectsSubtitle: "I have worked on dozens of special projects during my career. Below are a few highlighted projects and recent recognition.",
    skillsSubtitle: "Skilled in Quality Management System and Document Review & Publication as well as in tools like MS Office and AI tools.",
    contactSubtitle: "Please reach out and contact me if you have any questions regarding my work."
  },

  /* ---------- 2. Projects / Awards Showcase ----------
     type:  "project" | "award"
     image: optional path under assets/img/ (placeholder used if empty)
     imagePosition: optional crop anchor for the 16:9 frame, e.g. "left center", "50% 20%"
     links: optional list of { label, url }                          */
  showcase: [
    {
      type: "project",
      title: "Biopharmaceutical Perfusion Tiger Team",
      date: "2022",
      description: "Led a team of cross-functional leaders to eliminate priority issues causing production shutdowns.",
      tags: [],
      image: "assets/img/biopharma_perfusion.jpg",
      links: []
    },
    {
      type: "project",
      title: "Deploy Augmented Reality Headsets for Training",
      date: "2020",
      description: "Wrote augmented reality training programs using Microsoft HoloLens for training, general production use, and virtual client interactions.",
      tags: [],
      image: "assets/img/ar_headset_training.jpg",
      links: []
    },
    {
      type: "award",
      title: "Boeing Gold Recognition",
      date: "2026",
      description: "Recognized by leadership for outstanding work and exemplifying the company values.",
      tags: ["Award"],
      image: "assets/img/boeing_gold_recognition.jpg",
      links: []
    }
  ],

  /* ---------- 3. Skills ----------
     Each group lists skills as { name, level } (level 0–100 shows a bar)
     or as plain strings (shown as chips). An optional `description`
     shows a paragraph; leave `items` empty to show only the paragraph.                              */
  skills: [
    {
      category: "Quality Management System",
      icon: "📋",
      items: [
        { name: "SQL Coding", level: 90 },
        { name: "Data Projection", level: 95 },
        { name: "Python Coding", level: 75 }
      ]
    },
    {
      category: "Document Review & Publication",
      icon: "🖥️",
      description:
        "Gather relevant information from process SMEs, facilitate review sessions, cross-reference linked documents, and code and push document updates through relevant systems.",
      items: []
    },
    {
      category: "Tools",
      icon: "🛠️",
      items: ["MS Office", "Claude AI", "RCCA", "Git"]
    }
  ],

  /* ---------- 4. Contact ----------
     Empty values are hidden automatically.                          */
  contact: {
    email: "dmnahlik@gmail.com",
    phone: "(314) 974-1178",                     // shown as a tap-to-call link
    location: "Arnold, Missouri",
    links: [
      { label: "GitHub", url: "https://github.com/dmnahlik", icon: "github" },
      { label: "LinkedIn", url: "", icon: "linkedin" } // TODO: LinkedIn URL
    ]
  }
};
