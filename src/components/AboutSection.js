import '../styles/AboutSection.css';
import { Skills } from './Skills';


function AboutSection({ active, controlFunction, mode}) {

    let lowerCaseMode=mode.toLowerCase();

    let skillList=['Html','Css','JavaScript','React','Git','Adobe-Illustrator','Figma','AutoCAD','Json','Api','SketchUp','Clip-Studio-Paint']

    return (
        <section className={active?`aboutSection ${lowerCaseMode}ModeComponent`:`aboutSection ${lowerCaseMode}ModeComponent inactive`}>

            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            <p className={`${lowerCaseMode}ModeElement`}>Front-End Developer with entry-level experience specializing in web development, user interface design, HTML, CSS, JavaScript, and ReactJS. Additionally, I have a keen interest in illustration, and I am constantly looking to broaden my horizons and stay up-to-date with the latest trends and technologies. My goal is to become a Full-Stack Developer, and I am always eager to learn and expand my skillset to achieve this.</p>
            <Skills skillList={skillList} mode={mode} />
            <section className='links'>
                <a href='https://github.com/SFCC5555' className={`${lowerCaseMode}ModeElement`}><span className={`skillIcon GitHubIcon${mode}`}></span>GitHub</a>
                <a href={require('../assets/documents/CVFernandoCarrasco.pdf')} className={`${lowerCaseMode}ModeElement`}><span className={`skillIcon cvIcon${mode}`}></span>CV</a>
            </section>

        </section>

    )
};

export { AboutSection };