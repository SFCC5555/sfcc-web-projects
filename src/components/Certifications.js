import '../styles/Certifications.css';
import data from '../data.json';


function Certifications({mode}) {

    const lowerCaseMode=mode.toLowerCase();


    return (<main className='sectionContainer'>
                <div className='sectionGap' id='CERTIFICATIONS'></div>
                <h2 className={`${lowerCaseMode}ModeElement`}>CERTIFICATIONS</h2>
                <section>

                </section>
                <section className='certificationContainer'>
                    
                    {
                     data.certifications.map(certification=>(
                        <div key={certification.name} className={`${lowerCaseMode}ModeComponent certification`}>
                            <a href={certification.link} target='_blank' rel="noreferrer" ><span className={`certificationIlustration ${certification.name}`} /></a>
                        </div>
                     ))   
                    }

                </section>
            </main>
    
    )
};

export { Certifications };