"use client";

import { useEffect, useRef } from "react";
import type { ShowcaseItem } from "@/data/portfolio";

const PLACEHOLDER_IMG = "/assets/img/project_placeholder.svg";

export default function ShowcaseCard({ item, hidden }: { item: ShowcaseItem; hidden: boolean }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const links = (item.links ?? []).filter((l) => l.url);
  const tags = item.tags ?? [];

  // Set the crop anchor through the DOM style API (allowed by the CSP),
  // not a style="" attribute (blocked by the CSP).
  useEffect(() => {
    if (imgRef.current && item.imagePosition) {
      imgRef.current.style.objectPosition = item.imagePosition;
    }
  }, [item.imagePosition]);

  return (
    <article className="card reveal" data-type={item.type} hidden={hidden}>
      <div className="card__media">
        <img
          ref={imgRef}
          src={item.image || PLACEHOLDER_IMG}
          alt={item.image ? item.title : ""}
          loading="lazy"
          width={640}
          height={360}
        />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="card__type">{item.type === "award" ? "Award" : "Project"}</span>
          {item.date && <span>{item.date}</span>}
        </div>
        <h3 className="card__title">{item.title}</h3>
        <p className="card__desc">{item.description}</p>
        {tags.length > 0 && (
          <div className="card__tags">
            {tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className="card__links">
            {links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener">
                {l.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
