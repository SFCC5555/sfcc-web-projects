import '../styles/Menu.scss';


function Menu({ sectionsList, active, controlFunction, mode }) {

    let lowerCaseMode=mode.toLowerCase();

    function closeMenu() {

        if (window.innerWidth<900) {
            controlFunction();
        }

    }

    return (
        <section className={active?`menu ${lowerCaseMode}ModeComponent`:`menu ${lowerCaseMode}ModeComponent inactive`}>
            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
            {
                sectionsList.map(section=>(<a onClick={closeMenu} href={`#${section}`} className={`${lowerCaseMode}ModeElement`} key={section}>{section}</a>))
            }


        </section>

    )
};

export { Menu };