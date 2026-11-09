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
    title: "TODO: Your Title / Role",           // e.g. "Cloud & Software Developer"
    intro:
      "Hardworking Quality Leader with a focus in continuous improvement and Lean Six Sigma. With over a decade of experience in pharmaceutical and aerospace manufacturing, I have worked hundreds of corrective actions and Lean projects that have reduced cost and waste for the various companies I have worked for.",
    photo: "assets/img/headshot.jpg",
    resume: ""                                   // TODO: e.g. "assets/resume/David_Nahlik_Resume.pdf" (button hidden while empty)
  },

  /* Section subtitles */
  sections: {
    projectsSubtitle: "TODO: A short line about the work and recognition highlighted below.",
    skillsSubtitle: "TODO: A short line summarizing your technical strengths.",
    contactSubtitle: "Please reach out and contact me if you have any questions regarding my work."
  },

  /* ---------- 2. Projects / Awards Showcase ----------
     type:  "project" | "award"
     image: optional path under assets/img/ (placeholder used if empty)
     links: optional list of { label, url }                          */
  showcase: [
    {
      type: "project",
      title: "TODO: Project One",
      date: "2026",
      description: "TODO: What it is, the problem it solves, and your role.",
      tags: ["TODO", "Tech", "Stack"],
      image: "",
      links: [
        { label: "Code", url: "https://github.com/dmnahlik" },
        { label: "Live Demo", url: "" }
      ]
    },
    {
      type: "project",
      title: "TODO: Project Two",
      date: "2026",
      description: "TODO: Short description of the project and its impact.",
      tags: ["TODO"],
      image: "",
      links: []
    },
    {
      type: "award",
      title: "TODO: Award / Recognition",
      date: "2026",
      description: "TODO: Who awarded it and why.",
      tags: ["Award"],
      image: "",
      links: []
    }
  ],

  /* ---------- 3. Skills ----------
     Each group lists skills as { name, level } (level 0–100 shows a bar)
     or as plain strings (shown as chips).                              */
  skills: [
    {
      category: "TODO: Languages",
      icon: "💻",
      items: [
        { name: "TODO: Skill A", level: 85 },
        { name: "TODO: Skill B", level: 70 }
      ]
    },
    {
      category: "TODO: Cloud & DevOps",
      icon: "☁️",
      items: [
        { name: "TODO: Skill C", level: 75 },
        { name: "TODO: Skill D", level: 60 }
      ]
    },
    {
      category: "TODO: Tools",
      icon: "🛠️",
      items: ["TODO", "Chip", "Style", "Skills"]
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
