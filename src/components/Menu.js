import '../styles/Menu.css';


function Menu({ sectionsList }) {
    return (
        <section className='menu lightModeComponent'>

            {
                sectionsList.map(section=>(<div className='lightModeElement' key={section}>{section}</div>))
            }


        </section>

    )
};

export { Menu };