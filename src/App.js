//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { NavBar } from './components/NavBar.js';

function App() {
  return (
      <React.Fragment>
        <NavBar />
        <h1 className='lightMode'>SFCf</h1>
        <img alt='verga' src={require('./assets/icons/sIcon.png')} />
      </React.Fragment>
  );
}

export default App;
