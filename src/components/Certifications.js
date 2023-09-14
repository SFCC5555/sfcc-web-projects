// Importing required styles and data
import '../styles/Certifications.scss';
import data from '../data.json';
import { useState } from 'react';

// Functional component to display certifications
function Certifications({ mode }) {
  // Convert mode to lowercase
  const lowerCaseMode = mode.toLowerCase();

  // State to manage certification source and link
  let [srcCertification, setSrcCertification] = useState('');
  let [linkCertification, setLinkCertification] = useState('');
  let [activeCertification, setActiveCertification] = useState(false);

  // Function to close the displayed certification
  function closeCertification() {
    setActiveCertification(false);
  }

  // Function to render and display a certification
  function renderCertification(event) {
    setActiveCertification(false);
    setTimeout(() => {
      setSrcCertification(event.target.id);
      setLinkCertification(event.target.attributes.link.value);
      setActiveCertification(true);
    });
  }

  return (
    <main className='sectionContainer'>
      <div className='sectionGap' id='CERTIFICATIONS'></div>
      <h2 className={`${lowerCaseMode}ModeElement`}>CERTIFICATIONS</h2>
      {activeCertification && (
        <div className={`${lowerCaseMode}ModeComponent renderCertificationContainer`}>
          <div onClick={closeCertification} className={`closeIcon lightModeElement`}>
            X
          </div>
          <a href={linkCertification[0] === 'h' ? linkCertification : require(`../assets/documents/${linkCertification}`)} target='_Blank' rel="noreferrer">
            <span className='externalLinkIcon' />
          </a>
          <img src={srcCertification ? require(`../assets/images/certificationIllustrations/${srcCertification}Color.png`) : ''} alt={srcCertification} />
        </div>
      )}
      <section className='certificationContainer'>
        {data.certifications.map(certification => (
          <div key={certification.name} className={`${lowerCaseMode}ModeComponent certification`}>
            <span onClick={renderCertification} link={certification.link} title={certification.date} id={certification.name} className={`certificationIllustration`} style={{ backgroundImage: `url(${require(`../assets/images/certificationIllustrations/${certification.name}Color.png`)})` }} />
          </div>
        ))}
      </section>
    </main>
  );
}

export { Certifications };