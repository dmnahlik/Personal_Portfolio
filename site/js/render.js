/* =========================================================
   RENDER: turns window.PORTFOLIO (data.js) into page markup.
   Builds DOM nodes with textContent, so content is never
   interpreted as HTML.
   ========================================================= */

(function () {
  "use strict";

  const data = window.PORTFOLIO || {};
  const PLACEHOLDER_IMG = "assets/img/project_placeholder.svg";

  const ICONS = {
    github:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    linkedin:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    email:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    phone:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    location:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    link:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
  };

  /* Small DOM helper: el("div", { class: "x" }, child, "text") */
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === false) return;
      if (k === "class") node.className = v;
      else node.setAttribute(k, v);
    });
    children.flat().forEach((c) => {
      if (c === null || c === undefined || c === "") return;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  function icon(name) {
    const span = document.createElement("span");
    span.innerHTML = ICONS[name] || ICONS.link; // static, trusted SVG strings only
    return span.firstChild;
  }

  function get(path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), data);
  }

  /* Simple text bindings: <el data-bind="profile.name"> */
  function bindText() {
    document.querySelectorAll("[data-bind]").forEach((node) => {
      const value = get(node.dataset.bind);
      if (value !== undefined) node.textContent = value;
    });
  }

  /* ---------- 1. Home ---------- */
  function renderHero() {
    const p = data.profile || {};
    const photo = document.getElementById("hero-photo");
    if (photo && p.photo) {
      photo.src = p.photo;
      photo.alt = "Portrait of " + (p.name || "me");
    }
    if (p.name) document.title = p.name + " | Portfolio";
  }

  /* ---------- 2. Showcase ---------- */
  function renderShowcase() {
    const grid = document.getElementById("showcase-grid");
    if (!grid) return;
    const items = data.showcase || [];
    grid.replaceChildren();

    if (!items.length) {
      grid.append(el("p", { class: "empty-state" }, "Projects and awards coming soon."));
      return;
    }

    items.forEach((item) => {
      const links = (item.links || []).filter((l) => l && l.url);
      const img = el("img", {
        src: item.image || PLACEHOLDER_IMG,
        alt: item.image ? item.title : "",
        loading: "lazy",
        width: "640",
        height: "360"
      });
      if (item.imagePosition) img.style.objectPosition = item.imagePosition;
      const card = el(
        "article",
        { class: "card reveal", "data-type": item.type || "project" },
        el("div", { class: "card__media" }, img),
        el(
          "div",
          { class: "card__body" },
          el(
            "div",
            { class: "card__meta" },
            el("span", { class: "card__type" }, item.type === "award" ? "Award" : "Project"),
            item.date ? el("span", {}, item.date) : null
          ),
          el("h3", { class: "card__title" }, item.title || "Untitled"),
          el("p", { class: "card__desc" }, item.description || ""),
          item.tags && item.tags.length
            ? el("div", { class: "card__tags" }, item.tags.map((t) => el("span", { class: "tag" }, t)))
            : null,
          links.length
            ? el(
                "div",
                { class: "card__links" },
                links.map((l) => el("a", { href: l.url, target: "_blank", rel: "noopener" }, l.label + " →"))
              )
            : null
        )
      );
      grid.append(card);
    });
  }

  /* ---------- 3. Skills ---------- */
  function renderSkills() {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;
    grid.replaceChildren();

    (data.skills || []).forEach((group) => {
      const items = group.items || [];
      const allChips = items.every((s) => typeof s === "string");

      const list = !items.length
        ? null
        : allChips
        ? el("div", { class: "skill-chips" }, items.map((s) => el("span", { class: "tag" }, s)))
        : el(
            "ul",
            { class: "skill-list" },
            items.map((s) => {
              const name = typeof s === "string" ? s : s.name;
              const level = typeof s === "object" && Number.isFinite(s.level) ? Math.max(0, Math.min(100, s.level)) : null;
              const li = el(
                "li",
                {},
                el("div", { class: "skill__row" }, el("span", {}, name), level !== null ? el("span", { class: "skill__level" }, level + "%") : null)
              );
              if (level !== null) {
                const fill = el("div", { class: "skill__fill" });
                fill.style.setProperty("--level", level + "%");
                li.append(el("div", { class: "skill__bar", role: "presentation" }, fill));
              }
              return li;
            })
          );

      grid.append(
        el(
          "div",
          { class: "skill-group reveal" },
          el("h3", { class: "skill-group__title" }, group.icon ? el("span", { class: "skill-group__icon", "aria-hidden": "true" }, group.icon) : null, group.category),
          group.description ? el("p", { class: "skill-group__desc" }, group.description) : null,
          list
        )
      );
    });
  }

  /* ---------- 4. Contact ---------- */
  function renderContact() {
    const c = data.contact || {};
    const emailLink = document.getElementById("email-link");
    const copyBtn = document.getElementById("copy-email");

    if (c.email) {
      emailLink.href = "mailto:" + c.email;
    } else {
      emailLink.hidden = true;
      copyBtn.hidden = true;
    }

    const list = document.getElementById("contact-links");
    if (!list) return;
    list.replaceChildren();

    if (c.email) {
      list.append(el("li", {}, el("a", { class: "contact__link", href: "mailto:" + c.email }, icon("email"), c.email)));
    }

    if (c.phone) {
      const digits = c.phone.replace(/[^\d+]/g, "");
      const tel = digits.startsWith("+") ? digits : "+1" + digits; // assumes a US number unless one starts with +
      list.append(el("li", {}, el("a", { class: "contact__link", href: "tel:" + tel }, icon("phone"), c.phone)));
    }

    (c.links || [])
      .filter((l) => l && l.url)
      .forEach((l) => {
        list.append(
          el("li", {}, el("a", { class: "contact__link", href: l.url, target: "_blank", rel: "noopener" }, icon(l.icon), l.label))
        );
      });

    if (c.location) {
      list.append(el("li", {}, el("span", { class: "contact__link" }, icon("location"), c.location)));
    }
  }

  bindText();
  renderHero();
  renderShowcase();
  renderSkills();
  renderContact();
})();
