"use client";

import { useState } from "react";
import type { ShowcaseItem } from "@/data/portfolio";
import ShowcaseCard from "./ShowcaseCard";

type Filter = "all" | ShowcaseItem["type"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "project", label: "Projects" },
  { value: "award", label: "Awards" },
];

/** 2. Projects / Awards Showcase */
export default function Showcase({ items, subtitle }: { items: ShowcaseItem[]; subtitle: string }) {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <section className="section section--alt" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section__header reveal">
          <h2 className="section__title" id="projects-title">
            Projects &amp; Awards
          </h2>
          <p className="section__subtitle">{subtitle}</p>
        </header>

        <div className="filters reveal" role="group" aria-label="Filter showcase">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              className={"filter" + (filter === value ? " is-active" : "")}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="card-grid" aria-live="polite">
          {items.length === 0 ? (
            <p className="empty-state">Projects and awards coming soon.</p>
          ) : (
            items.map((item) => (
              <ShowcaseCard key={item.title} item={item} hidden={filter !== "all" && item.type !== filter} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
