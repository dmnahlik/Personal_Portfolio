import type { SkillGroup as SkillGroupData } from "@/data/portfolio";
import SkillGroup from "./SkillGroup";

/** 3. Skills */
export default function Skills({ groups, subtitle }: { groups: SkillGroupData[]; subtitle: string }) {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <header className="section__header reveal">
          <h2 className="section__title" id="skills-title">
            Skills
          </h2>
          <p className="section__subtitle">{subtitle}</p>
        </header>
        <div className="skills-grid">
          {groups.map((g) => (
            <SkillGroup key={g.category} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
