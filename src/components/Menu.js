import '../styles/Menu.css';


function Menu({ sectionsList, active, controlFunction, mode }) {

    let lowerCaseMode=mode.toLowerCase();

    return (
        <section className={active?`menu ${lowerCaseMode}ModeComponent`:`menu ${lowerCaseMode}ModeComponent inactive`}>
            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            {
                sectionsList.map(section=>(<a href={`#${section}`} className={`${lowerCaseMode}ModeElement`} key={section}>{section}</a>))
            }


        </section>

    )
};

export { Menu };