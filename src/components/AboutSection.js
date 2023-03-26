import '../styles/AboutSection.css';
import { Skills } from './Skills';


function AboutSection({ active, controlFunction, mode}) {

    let lowerCaseMode=mode.toLowerCase();

    let skillList=['Html','Css','JavaScript','React','Git']

    return (
        <section className={active?`aboutSection ${lowerCaseMode}ModeComponent`:`aboutSection ${lowerCaseMode}ModeComponent inactive`}>

            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            <p className={`${lowerCaseMode}ModeElement`}>A Front-End Developer with entry-level experience specializing in web development, user interface design, HTML, CSS, JavaScript and ReactJS. Adept at identifying opportunities to enhance front-end design and improve the user experience.</p>
            <Skills skillList={skillList} mode={mode} />
            <section className='links'>
                <a href='https://github.com/SFCC5555' className={`${lowerCaseMode}ModeElement`}><span className={`skillIcon GitHubIcon${mode}`}></span>GitHub</a>
                <a href={require('../assets/documents/CVFernandoCarrasco.pdf')} className={`${lowerCaseMode}ModeElement`}><span className={`skillIcon GitHubIcon${mode}`}></span>CV</a>
            </section>

        </section>

    )
};

export { AboutSection };