import React from 'react';
import '../styles/NavBar.css';
import { Menu } from './Menu';


function NavBar({ sectionsList }) {
    return (
        <React.Fragment>
            <nav className="navBar lightModeComponent">
                <span className="burgerIcon burgerIconLight"></span>
                <a href='.' className='sFernando lightModeElement'>ING. S. FERNANDO CARRASCO</a>
                <div className='aboutMe lightModeElement'><span className="sfccPicture"></span>ABOUT ME</div>
            </nav>
            <Menu sectionsList={sectionsList}/>
        </React.Fragment>
    )
};

export { NavBar };