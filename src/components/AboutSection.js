import '../styles/AboutSection.css';
import { Skills } from './Skills';


function AboutSection({ active, controlFunction, mode}) {

    let lowerCaseMode=mode.toLowerCase();

    let skillList=['Html','Css','JavaScript','TypeScript','React','Git','Adobe-Illustrator']

    return (
        <section className={active?`aboutSection ${lowerCaseMode}ModeComponent`:`aboutSection ${lowerCaseMode}ModeComponent inactive`}>

            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            <p className={`${lowerCaseMode}ModeElement`}>Front-End Developer with experience in web development and user interface design with responsive design and a mobile-first approach. I have expertise in technologies such as HTML, CSS, JavaScript, ReactJS, Tailwind, and Git, among others. I am constantly seeking opportunities to expand my skills, learn, and explore new technologies in order to grow professionally and access better job opportunities. My passion lies in problem-solving and creating applications with high-quality user experiences.</p>
            <Skills skillList={skillList} mode={mode} noWarp='noWarp'/>
            <section className='links'>
                <a href='https://github.com/SFCC5555' className={`${lowerCaseMode}ModeElement`} target='_Blank' rel="noreferrer"  ><span className={`skillIcon GitHubIcon${mode}`} />GitHub</a>
                <a href={require('../assets/documents/RESUME2023FERNANDOCARRASCO.pdf')} className={`${lowerCaseMode}ModeElement`} target='_Blank' rel="noreferrer" ><span className={`skillIcon cvIcon${mode}`}/>CV</a>
            </section>

        </section>

    )
};

export { AboutSection };

