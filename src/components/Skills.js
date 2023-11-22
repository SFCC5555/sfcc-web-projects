// Importing necessary styles
import "../styles/Skills.scss";

// Functional component for displaying skills
function Skills({ skillList, mode, noWarp }) {
  return (
    <section className={`skillContainer ${noWarp}`}>
      {/* Mapping over the skillList and displaying each skill icon */}
      {skillList.map((skill) => (
        <span
          key={skill}
          title={skill}
          className={`skillIcon ${
            skill[0].toLowerCase() + skill.slice(1)
          }Icon${mode}`}
        ></span>
      ))}
    </section>
  );
}

// Setting default prop for noWarp
Skills.defaultProps = { noWarp: "warp" };

export { Skills };
