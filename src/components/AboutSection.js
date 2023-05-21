import '../styles/AboutSection.css';
import { Skills } from './Skills';


function AboutSection({ active, controlFunction, mode}) {

    let lowerCaseMode=mode.toLowerCase();

    let skillList=['Html','Css','JavaScript','TypeScript','React','Git','Adobe-Illustrator']

    return (
        <section className={active?`aboutSection ${lowerCaseMode}ModeComponent`:`aboutSection ${lowerCaseMode}ModeComponent inactive`}>

            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            <p className={`${lowerCaseMode}ModeElement`}>Front-End Developer with experience in web development, user interface design, and technologies such as HTML, CSS, JavaScript, and ReactJS. My goal is to become a Full-Stack Developer, and I am constantly seeking opportunities to expand my skills. I am passionate about problem-solving and creating quality user experiences. I am interested in a position that allows me to develop and enhance my skills while growing professionally.</p>
            <Skills skillList={skillList} mode={mode} noWarp='noWarp'/>
            <section className='links'>
                <a href='https://github.com/SFCC5555' className={`${lowerCaseMode}ModeElement`}><span className={`skillIcon GitHubIcon${mode}`}></span>GitHub</a>
                <a href={require('../assets/documents/CVFernandoCarrasco.pdf')} className={`${lowerCaseMode}ModeElement`}><span className={`skillIcon cvIcon${mode}`}></span>CV</a>
            </section>

        </section>

    )
};

export { AboutSection };

