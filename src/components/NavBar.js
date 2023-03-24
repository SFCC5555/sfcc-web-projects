import React from 'react';
import '../styles/NavBar.css';
import { Menu } from './Menu';
import { useState } from 'react';
import { AboutSection } from './AboutSection';


function NavBar({ sectionsList, mode }) {

    let [active,setActive] = useState(false);
    let [icon,setIcon] = useState('burgerIcon');

    let [activeAbout,setActiveAbout] = useState(false);
    let [picture,setPicture] = useState('sfccPictureBW');

    let lowerCaseMode = mode.toLowerCase();
    
    function controlMenu() {

        active?setActive(false):setActive(true);

        icon==='burgerIcon'?setIcon('sIcon'):setIcon('burgerIcon');

        setActiveAbout(false);

        setPicture('sfccPictureBW');
        
    };

    function controlAboutMe() {
        
        activeAbout?setActiveAbout(false):setActiveAbout(true);
        picture==='sfccPicture'?setPicture('sfccPictureBW'):setPicture('sfccPicture');

        setActive(false);

        setIcon('burgerIcon');

    };

    return (
        <React.Fragment>
            <nav className={`navBar ${lowerCaseMode}ModeComponent`}>
                <span onClick={controlMenu} className={`${icon} ${icon}${mode}`}></span>
                <a href='.' className={`sFernando ${lowerCaseMode}ModeElement`}>ING. S. FERNANDO CARRASCO</a>
                <div onClick={controlAboutMe} className={`aboutMe ${lowerCaseMode}ModeElement`}><span className={`picture ${picture}`}></span>ABOUT ME</div>
            </nav>
            <Menu active={active} sectionsList={sectionsList} controlFunction={controlMenu} mode={mode} />
            <AboutSection active={activeAbout} controlFunction={controlAboutMe} mode={mode}/>
        </React.Fragment>
    )
};

export { NavBar };