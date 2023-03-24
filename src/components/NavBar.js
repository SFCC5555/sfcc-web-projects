import React from 'react';
import '../styles/NavBar.css';
import { Menu } from './Menu';
import { useState } from 'react';
import { AboutSection } from './AboutSection';


function NavBar({ sectionsList }) {

    let [active,setActive] = useState(false);
    let [icon,setIcon] = useState('burgerIcon');

    let [activeAbout,setActiveAbout] = useState(false);
    let [picture,setPicture] = useState('sfccPictureBW');
    
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
            <nav className="navBar lightModeComponent">
                <span onClick={controlMenu} className={`${icon} ${icon}Light`} ></span>
                <a href='.' className='sFernando lightModeElement'>ING. S. FERNANDO CARRASCO</a>
                <div onClick={controlAboutMe} className='aboutMe lightModeElement'><span className={`picture ${picture}`}></span>ABOUT ME</div>
            </nav>
            <Menu active={active} sectionsList={sectionsList} controlFunction={controlMenu}/>
            <AboutSection active={activeAbout} controlFunction={controlAboutMe}/>
        </React.Fragment>
    )
};

export { NavBar };