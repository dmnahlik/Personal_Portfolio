/* =========================================================
   MAIN: interactions (Responsive nav, Professional Polish)
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  navLinks.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- Header shadow on scroll ---------- */
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active section highlight ---------- */
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) => {
            const active = a.getAttribute("href") === id;
            a.classList.toggle("is-active", active);
            if (active) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Showcase filter ---------- */
  const filters = document.querySelectorAll(".filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll("#showcase-grid .card").forEach((card) => {
        card.hidden = f !== "all" && card.dataset.type !== f;
      });
    })
  );

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.querySelector(".theme-toggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");

  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* storage unavailable: theme still applies for this visit */
    }
  });

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copy-email");
  const status = document.getElementById("copy-status");
  const email = (window.PORTFOLIO && window.PORTFOLIO.contact && window.PORTFOLIO.contact.email) || "";
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = "Email copied to clipboard.";
    } catch (e) {
      status.textContent = email;
    }
    setTimeout(() => (status.textContent = ""), 3000);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
