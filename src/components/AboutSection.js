import '../styles/AboutSection.css';


function AboutSection({ active, controlFunction, mode}) {

    let lowerCaseMode=mode.toLowerCase();

    return (
        <section className={active?`aboutSection ${lowerCaseMode}ModeComponent`:`aboutSection ${lowerCaseMode}ModeComponent inactive`}>

            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            <h2>blablabla</h2>
            <p>blablablablabla</p>


        </section>

    )
};

export { AboutSection };