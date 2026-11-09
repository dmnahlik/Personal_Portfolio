"use client";

import { useEffect } from "react";

/**
 * Scroll reveal: adds `is-visible` to every `.reveal` element as it enters
 * the viewport (CSS in styles/base.css fades it in; skill bars fill).
 * Renders nothing; mounted once by the page.
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
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
    els.forEach((el) => revealer.observe(el));
    return () => revealer.disconnect();
  }, []);

  return null;
}
