//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { NavBar } from './components/NavBar.js';
import { DarkModeButton } from './components/DarkModeButton';
import { useState } from 'react';

function App() {
  const sectionsList = ['WEB PROJECTS','CERTIFICATIONS','CODE NETWORKS','CONTACT','BUY ME A COFFEE'];

  const body = document.querySelector('body')

  let [mode,setMode] = useState('Light');
  
  function controlDarkMode() {
    mode==='Light'?setMode('Dark'):setMode('Light');
    body.classList.toggle('lightMode');
  }


  return (
      <React.Fragment>
        <NavBar sectionsList={sectionsList} mode={mode}/>
        <img alt='sfcc Icon' className='sfccIcon' src={require(`./assets/icons/sfccIcon${mode}.png`)} />
        <DarkModeButton controlFunction={controlDarkMode} mode={mode}/>
      </React.Fragment>
  );
}

export default App;
