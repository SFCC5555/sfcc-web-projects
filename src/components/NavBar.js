import React from 'react';
import '../styles/NavBar.css';
import { Menu } from './Menu';
import { useState } from 'react';


function NavBar({ sectionsList }) {

    let [active,setActive] = useState(false);
    
    function controlMenu() {

        active?setActive(false):setActive(true);
        
    }

    return (
        <React.Fragment>
            <nav className="navBar lightModeComponent">
                <span onClick={controlMenu} className="burgerIcon burgerIconLight"></span>
                <a href='.' className='sFernando lightModeElement'>ING. S. FERNANDO CARRASCO</a>
                <div className='aboutMe lightModeElement'><span className="sfccPicture"></span>ABOUT ME</div>
            </nav>
            <Menu active={active} sectionsList={sectionsList}/>
        </React.Fragment>
    )
};

export { NavBar };