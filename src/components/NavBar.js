import React from "react";
import { NavBarMobile } from "./NavBarMobile";
import { NavBarDesktop } from "./NavBarDesktop";
import '../styles/NavBar.css';


function NavBar() {
    return (
        <React.Fragment>
            <NavBarMobile />
            <NavBarDesktop />
        </React.Fragment>

    )
};

export { NavBar };