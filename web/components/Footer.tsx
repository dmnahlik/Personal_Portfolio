"use client";

import { useEffect, useRef } from "react";

export default function Footer({ name }: { name: string }) {
  const yearRef = useRef<HTMLSpanElement>(null);

  // The page is built ahead of time, so refresh the year in the browser
  // (keeps it correct after New Year without a rebuild).
  useEffect(() => {
    if (yearRef.current) yearRef.current.textContent = String(new Date().getFullYear());
  }, []);

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          &copy; <span ref={yearRef}>{new Date().getFullYear()}</span> {name}. All rights reserved.
        </p>
        <a href="#top" className="back-to-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
