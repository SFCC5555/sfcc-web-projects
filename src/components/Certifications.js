import '../styles/Certifications.css';
import data from '../data.json';
import { useState } from 'react';


function Certifications({mode}) {

    const lowerCaseMode=mode.toLowerCase();

    let [srcCertification,setSrcCertification] = useState('');

    let [linkCertification,setLinkCertification] = useState('');

    let [activeCertification,setActiveCertification] = useState(false);

    function closeCertification() {
        setActiveCertification(false);
    }
    
    function renderCertification(event) {
        setActiveCertification(false);
        setTimeout(()=>{
            setSrcCertification(event.target.id);
            setLinkCertification(event.target.attributes.link.value);
            setActiveCertification(true);
        })
    }



    return (<main className='sectionContainer'>
                <div className='sectionGap' id='CERTIFICATIONS'></div>
                <h2 className={`${lowerCaseMode}ModeElement`}>CERTIFICATIONS</h2>
                {activeCertification&&<div className={`${lowerCaseMode}ModeComponent renderCertificationContainer`}>
                    <div onClick={closeCertification} className={`closeIcon lightModeElement`}>X</div>
                    <a href={linkCertification[0]==='h'?linkCertification:require(`../assets/documents/${linkCertification}`)} target='_Blank'><span className='externalLinkIcon'/></a>
                    <img src={srcCertification?require(`../assets/images/certificationIllustrations/${srcCertification}Color.png`):''} alt={srcCertification} ></img>
                </div>}
                <section className='certificationContainer'>
                    
                    {
                     data.certifications.map(certification=>(
                        <div key={certification.name} className={`${lowerCaseMode}ModeComponent certification`}>
                            <span onClick={renderCertification} link={certification.link} id={certification.name} className={`certificationIllustration`} style={{backgroundImage:`url(${require(`../assets/images/certificationIllustrations/${certification.name}Color.png`)})`}} />
                        </div>
                     ))   
                    }

                </section>
            </main>
    
    )
};

export { Certifications };