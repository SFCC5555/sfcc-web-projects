import '../styles/AboutSection.css';


function AboutSection({ active, controlFunction}) {

    return (
        <section className={active?'aboutSection lightModeComponent':'aboutSection lightModeComponent inactive'}>

            <button onClick={controlFunction} className='closeIcon lightModeElement'>X</button>
            <h2>blablabla</h2>
            <p>blablablablabla</p>


        </section>

    )
};

export { AboutSection };