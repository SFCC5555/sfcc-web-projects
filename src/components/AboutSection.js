// Importing the required styles
import "../styles/AboutSection.scss";

// Importing the Skills component
import { Skills } from "./Skills";

// Functional component for the About Section
function AboutSection({ active, controlFunction, mode }) {
  let lowerCaseMode = mode.toLowerCase();

  // List of skills
  let skillList = [
    "Html",
    "Css",
    "JavaScript",
    "React",
    "NodeJS",
    "MongoDB",
    "Git",
  ];

  return (
    <section
      className={
        active
          ? `aboutSection ${lowerCaseMode}ModeComponent`
          : `aboutSection ${lowerCaseMode}ModeComponent inactive`
      }
    >
      {/* Button to close the About Section */}
      <div
        onClick={controlFunction}
        className={`closeIcon ${lowerCaseMode}ModeElement`}
      >
        X
      </div>

      {/* Description of the developer */}
      <p className={`${lowerCaseMode}ModeElement paragraph`}>
        I am a Fullstack Developer with experience in both frontend and backend
        development. My focus in frontend development has been on creating
        responsive web applications with a 'mobile-first' approach. I am
        proficient in technologies such as HTML, CSS, Sass, JavaScript,
        TypeScript, JSON, React.js, Redux, React Router V6, Bootstrap, and
        Tailwind. In the backend realm, I stand out in constructing RESTful APIs
        using Node.js and Express, and I have experience with databases like
        MongoDB and Mongoose. Additionally, as a Backend Developer, I have
        collaborated with multidisciplinary teams, contributing to the
        development of functionalities for enterprise web applications. I bring
        additional expertise in technologies like MySQL, GraphQL, Postman,
        Docker, and Strapi.
      </p>

      {/* Displaying the skills using the Skills component */}
      <Skills skillList={skillList} mode={mode} noWarp="noWarp" />

      {/* Links to external profiles */}
      <section className="links">
        <div>
          <a
            href="https://github.com/SFCC5555"
            className={`${lowerCaseMode}ModeElement`}
            target="_Blank"
            rel="noreferrer"
          >
            <span className={`skillIcon gitHubIcon${mode}`} />
            GitHub
          </a>
          <a
            href="https://drive.google.com/file/d/1bntSQPpDwL0KrQqfO3cw9y_o3BRCwGdU/view?usp=sharing"
            className={`${lowerCaseMode}ModeElement`}
            target="_Blank"
            rel="noreferrer"
          >
            <span className={`skillIcon cvIcon${mode}`} />
            CV
          </a>
        </div>
        <div>
          <a
            href="https://www.linkedin.com/in/fernando-carrasco-dev/"
            className={`${lowerCaseMode}ModeElement`}
            target="_Blank"
            rel="noreferrer"
          >
            <span className={`skillIcon linkedinIcon${mode}`} />
            Linkedin
          </a>
          <a
            href="https://www.getmanfred.com/perfil/sfcc5555"
            className={`${lowerCaseMode}ModeElement`}
            target="_Blank"
            rel="noreferrer"
          >
            <span className={`skillIcon manfredIcon${mode}`} />
            Manfred
          </a>
        </div>
      </section>
    </section>
  );
}

export { AboutSection };
