import '../styles/Menu.css';


function Menu({ sectionsList, active, controlFunction }) {

    return (
        <section className={active?'menu lightModeComponent':'menu lightModeComponent inactive'}>
            <div onClick={controlFunction} className='closeIcon lightModeElement'>X</div>
            {
                sectionsList.map(section=>(<div className='lightModeElement' key={section}>{section}</div>))
            }


        </section>

    )
};

export { Menu };