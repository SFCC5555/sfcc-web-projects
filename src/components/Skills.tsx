import "../styles/Skills.scss";
import { Mode } from "../types";

interface SkillsProps {
  skillList: string[];
  mode: Mode;
  noWarp?: string;
}

function Skills({ skillList, mode, noWarp = "warp" }: SkillsProps) {
  return (
    <section className={`skillContainer ${noWarp}`}>
      {skillList.map((skill) => (
        <span
          key={skill}
          data-tooltip={skill}
          className={`skillIcon ${
            skill[0].toLowerCase() + skill.slice(1)
          }Icon${mode}`}
        ></span>
      ))}
    </section>
  );
}

export { Skills };
