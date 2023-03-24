//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { NavBar } from './components/NavBar.js';

function App() {
  return (
      <React.Fragment>
        <NavBar />
        <img alt='sfcc Icon' className='sfccIcon' src={require('./assets/icons/sfccIcon.png')} />
      </React.Fragment>
  );
}

export default App;
