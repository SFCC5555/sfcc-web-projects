import "../styles/AboutSection.scss";
import { Skills } from "./Skills";
import { Mode } from "../types";

interface AboutSectionProps {
  active: boolean;
  controlFunction: () => void;
  mode: Mode;
}

function AboutSection({ active, controlFunction, mode }: AboutSectionProps) {
  const lowerCaseMode = mode.toLowerCase();

  const skillList = [
    "Html",
    "Css",
    "JavaScript",
    "React",
    "NodeJS",
    "MongoDB",
    "MySQL",
    "Strapi",
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
      <div
        onClick={controlFunction}
        className={`closeIcon ${lowerCaseMode}ModeElement`}
      >
        X
      </div>

      <p className={`${lowerCaseMode}ModeElement paragraph`}>
        I am a Full-Stack Developer with solid experience across the complete
        development lifecycle — frontend and backend — focused
        on product and critical operations. On the frontend, I build responsive
        web applications using TypeScript, React.js, Next.js, Tailwind, and
        modern JavaScript. On the backend, I design and maintain APIs and
        services using Node.js, Python, GraphQL, RabbitMQ, and Strapi, with
        experience in databases such as MySQL and PostgreSQL. I have worked in
        production environments with AWS (S3, Lambda, SES), handling document
        generation, event-driven notifications, and data migrations. I thrive in
        multidisciplinary teams, working with high autonomy, ownership, and a
        genuine commitment to code quality and continuous improvement.
      </p>

      <Skills skillList={skillList} mode={mode} noWarp="noWarp" />

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
