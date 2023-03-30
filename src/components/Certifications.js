import '../styles/Certifications.css';
import data from '../data.json';
import { useState } from 'react';


function Certifications({mode}) {

    const lowerCaseMode=mode.toLowerCase();

    let [srcCertification,setSrcCertification] = useState('');

    let [activeCertification,setActiveCertification] = useState(false);

    function closeCertification() {
        setActiveCertification(false);
    }
    
    function renderCertification(event) {
        setActiveCertification(false);
        setTimeout(()=>{
            setSrcCertification(event.target.id);
            setActiveCertification(true);
        })
    }



    return (<main className='sectionContainer'>
                <div className='sectionGap' id='CERTIFICATIONS'></div>
                <h2 className={`${lowerCaseMode}ModeElement`}>CERTIFICATIONS</h2>
                <div className={activeCertification?`${lowerCaseMode}ModeComponent renderCertificationContainer`:'inactive'}>
                    <div onClick={closeCertification} className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
                    <img src={srcCertification?require(`../assets/images/certificationIllustrations/${srcCertification}Color.png`):''} alt={srcCertification} ></img>
                </div>
                <section className='certificationContainer'>
                    
                    {
                     data.certifications.map(certification=>(
                        <div key={certification.name} className={`${lowerCaseMode}ModeComponent certification`}>
                            <span onClick={renderCertification} id={certification.name} className={`certificationIllustration ${certification.name}`} />
                        </div>
                     ))   
                    }

                </section>
            </main>
    
    )
};

export { Certifications };