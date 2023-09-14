// Importing required dependencies and styles
import React, { useState } from 'react';
import '../styles/Info.scss';

// Functional component for displaying additional information on hover
function Info({ mode, name, info }) {
  const [activeInfo, setActiveInfo] = useState(false);

  // Function to show additional information on hover
  function aboutInfo() {
    setActiveInfo(true);
  }

  // Function to close the additional information
  function closeAboutInfo() {
    setActiveInfo(false);
  }

  return (
    <>
      <span onMouseLeave={closeAboutInfo} onMouseEnter={aboutInfo} className={`skillIcon aboutIcon${mode} aboutIcon`} />

      {activeInfo && (
        <div className={`info info${mode}`}>
          <div className='infoTitle'>{name}</div>
          <p className='infoContent'>{info}</p>
        </div>
      )}
    </>
  );
}

export { Info };