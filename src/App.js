//import logo from './logo.svg';
import './App.scss';
import React from 'react';
import { NavBar } from './components/NavBar.js';
import { DarkModeButton } from './components/DarkModeButton';
import { Projects } from './components/Projects';
import { useState } from 'react';
import { Certifications } from './components/Certifications';
import { Form } from './components/Form';


const body = document.querySelector('body');

let storageMode = localStorage.getItem('mode')?localStorage.getItem('mode'):'Light';

storageMode==='Light'?body.classList.add('lightMode'):body.classList.remove('lightMode');


function App() {
  const sectionsList = ['WEB PROJECTS','CERTIFICATIONS','CONTACT'];

  let [mode,setMode] = useState(storageMode);
  
  function controlDarkMode() {
    mode==='Light'?setMode('Dark'):setMode('Light');
    body.classList.toggle('lightMode');
  }

  localStorage.setItem('mode',mode);

  return (
      <React.Fragment>
        <NavBar sectionsList={sectionsList} mode={mode}/>
        <img alt='sfcc Icon' className='sfccIcon' src={require(`./assets/icons/sfccIcon${mode}.png`)} />
        <DarkModeButton controlFunction={controlDarkMode} mode={mode}/>
        <Projects mode={mode}/>
        <Certifications mode={mode}/>
        <Form mode={mode}/>
      </React.Fragment>
  );
}

export default App;
