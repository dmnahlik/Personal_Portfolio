"use client";

import { useEffect, useRef } from "react";
import type { Skill, SkillGroup as SkillGroupData } from "@/data/portfolio";

function SkillBar({ name, level }: { name: string; level: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const clamped = Math.max(0, Math.min(100, level));

  // Bar width goes in a CSS variable set through the DOM style API (allowed by
  // the CSP); the bar animates to it when the group scrolls into view.
  useEffect(() => {
    fillRef.current?.style.setProperty("--level", clamped + "%");
  }, [clamped]);

  return (
    <li>
      <div className="skill__row">
        <span>{name}</span>
        <span className="skill__level">{clamped}%</span>
      </div>
      <div className="skill__bar" role="presentation">
        <div className="skill__fill" ref={fillRef} />
      </div>
    </li>
  );
}

const isChip = (s: Skill): s is string => typeof s === "string";

/** One skills card: bars ({ name, level }), chips (strings), and/or a description. */
export default function SkillGroup({ group }: { group: SkillGroupData }) {
  const { items } = group;
  const allChips = items.every(isChip);

  return (
    <div className="skill-group reveal">
      <h3 className="skill-group__title">
        {group.icon && (
          <span className="skill-group__icon" aria-hidden="true">
            {group.icon}
          </span>
        )}
        {group.category}
      </h3>
      {group.description && <p className="skill-group__desc">{group.description}</p>}
      {items.length > 0 &&
        (allChips ? (
          <div className="skill-chips">
            {items.filter(isChip).map((s) => (
              <span className="tag" key={s}>
                {s}
              </span>
            ))}
          </div>
        ) : (
          <ul className="skill-list">
            {items.map((s) =>
              isChip(s) ? (
                <li key={s}>
                  <div className="skill__row">
                    <span>{s}</span>
                  </div>
                </li>
              ) : (
                <SkillBar key={s.name} name={s.name} level={s.level} />
              )
            )}
          </ul>
        ))}
    </div>
  );
}
