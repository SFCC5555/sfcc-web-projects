// Importing the required styles
import '../styles/AboutSection.scss';

// Importing the Skills component
import { Skills } from './Skills';

// Functional component for the About Section
function AboutSection({ active, controlFunction, mode }) {
  let lowerCaseMode = mode.toLowerCase();

  // List of skills
  let skillList = ['Html', 'Css', 'JavaScript', 'React', 'Sass', 'Tailwind', 'Git'];

  return (
    <section className={active ? `aboutSection ${lowerCaseMode}ModeComponent` : `aboutSection ${lowerCaseMode}ModeComponent inactive`}>

      {/* Button to close the About Section */}
      <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
      
      {/* Description of the developer */}
      <p className={`${lowerCaseMode}ModeElement`}>
        Front-End Developer with experience in web development and user interface design with responsive design and a mobile-first approach.
        I have expertise in technologies such as HTML, CSS, JavaScript, ReactJS, Tailwind, and Git, among others.
        I am constantly seeking opportunities to expand my skills, learn, and explore new technologies in order to grow professionally and access better job opportunities.
        My passion lies in problem-solving and creating applications with high-quality user experiences.
      </p>

      {/* Displaying the skills using the Skills component */}
      <Skills skillList={skillList} mode={mode} noWarp='noWarp' />

      {/* Links to external profiles */}
      <section className='links'>
        <div>
          <a href='https://github.com/SFCC5555' className={`${lowerCaseMode}ModeElement`} target='_Blank' rel="noreferrer" ><span className={`skillIcon gitHubIcon${mode}`} />GitHub</a>
          <a href='https://drive.google.com/file/d/1sh3eWM3I2og1D7108vL0rXvl2YZ97G7N/view?usp=sharing' className={`${lowerCaseMode}ModeElement`} target='_Blank' rel="noreferrer" ><span className={`skillIcon cvIcon${mode}`} />CV</a>
        </div>
        <div>
          <a href='https://www.linkedin.com/in/fernando-carrasco-dev/' className={`${lowerCaseMode}ModeElement`} target='_Blank' rel="noreferrer" ><span className={`skillIcon linkedinIcon${mode}`} />Linkedin</a>
          <a href='https://www.getmanfred.com/perfil/sfcc5555' className={`${lowerCaseMode}ModeElement`} target='_Blank' rel="noreferrer" ><span className={`skillIcon manfredIcon${mode}`} />Manfred</a>
        </div>
      </section>
    </section>
  );
}

export { AboutSection };

