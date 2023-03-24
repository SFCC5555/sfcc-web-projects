import '../styles/Menu.css';


function Menu({ sectionsList, active }) {

    return (
        <section className={active?'menu lightModeComponent':'menu lightModeComponent inactive'}>

            {
                sectionsList.map(section=>(<div className='lightModeElement' key={section}>{section}</div>))
            }


        </section>

    )
};

export { Menu };