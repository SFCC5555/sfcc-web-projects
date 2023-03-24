//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { NavBar } from './components/NavBar.js';
import { DarkModeButton } from './components/DarkModeButton';

function App() {
  const sectionsList=['WEB PROJECTS','CERTIFICATIONS','CODE NETWORKS','CONTACT','BUY ME A COFFEE']
  return (
      <React.Fragment>
        <NavBar sectionsList={sectionsList}/>
        <img alt='sfcc Icon' className='sfccIcon' src={require('./assets/icons/sfccIcon.png')} />
        <DarkModeButton />
      </React.Fragment>
  );
}

export default App;
