import "../styles/Skills.scss";
import { Mode } from "../types";

interface SkillsProps {
  skillList: string[];
  mode: Mode;
  noWarp?: string;
  techIcons?: Record<string, string>;
  activeSkill?: string | null;
}

function Skills({ skillList, noWarp = "warp", techIcons = {}, activeSkill }: SkillsProps) {
  const techOrder = Object.fromEntries(Object.keys(techIcons).map((k, i) => [k, i]));
  const sorted = skillList.slice().sort((a, b) =>
    (techOrder[a] ?? 999) - (techOrder[b] ?? 999)
  );

  return (
    <section className={`skillContainer ${noWarp}`}>
      {sorted.map((skill) => {
        const iconUrl = techIcons[skill];
        const isActive = activeSkill === skill;
        const label = skill.replaceAll("-", " ");
        return iconUrl ? (
          <span key={skill} data-tooltip={label} data-skill={skill} className="skillIconWrapper">
            <img src={iconUrl} alt={label} className={`skillIcon${isActive ? " skillIcon--active" : ""}`} />
          </span>
        ) : (
          <span
            key={skill}
            data-tooltip={label}
            className={`skillIcon skillIconFallback${isActive ? " skillIconFallback--active" : ""}`}
          >
            {label[0].toUpperCase()}
          </span>
        );
      })}
    </section>
  );
}

export { Skills };
