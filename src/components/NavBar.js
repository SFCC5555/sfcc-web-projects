// Importing necessary modules and styles
import React from "react";
import "../styles/NavBar.scss";
import { Menu } from "./Menu";
import { useState } from "react";
import { AboutSection } from "./AboutSection";

// Functional component for the navigation bar
function NavBar({ sectionsList, mode }) {
  // State variables to manage the menu and about section visibility
  const [active, setActive] = useState(false);
  const [icon, setIcon] = useState("BurgerIcon");

  const [activeAbout, setActiveAbout] = useState(false);
  const [picture, setPicture] = useState("sfccPictureBW");

  // Converting mode to lowercase for class names
  const lowerCaseMode = mode.toLowerCase();

  // Function to control the menu visibility
  function controlMenu() {
    // Toggling the menu visibility
    active ? setActive(false) : setActive(true);

    // Toggling the menu icon between BurgerIcon and SIcon
    icon === "BurgerIcon" ? setIcon("SIcon") : setIcon("BurgerIcon");

    // Closing the About Me section if it's open
    setActiveAbout(false);

    // Setting the picture to default when the menu is opened
    setPicture("sfccPictureBW");
  }

  // Function to control the About Me section visibility
  function controlAboutMe() {
    // Toggling the About Me section visibility
    activeAbout ? setActiveAbout(false) : setActiveAbout(true);

    // Toggling the picture between sfccPicture and sfccPictureBW
    picture === "sfccPicture"
      ? setPicture("sfccPictureBW")
      : setPicture("sfccPicture");

    // Closing the menu if it's open
    setActive(false);

    // Setting the menu icon to BurgerIcon when About Me is opened
    setIcon("BurgerIcon");
  }

  return (
    <React.Fragment>
      <nav className={`navBar ${lowerCaseMode}ModeComponent`}>
        {/* Icon for controlling the menu */}
        <span
          onClick={controlMenu}
          className={`${icon} ${lowerCaseMode}${icon}`}
        ></span>
        {/* Brand link */}
        <a href="." className={`sFernando ${lowerCaseMode}ModeElement`}>
          ING. S. FERNANDO CARRASCO
        </a>
        {/* Button for opening the About Me section */}
        <div
          onClick={controlAboutMe}
          className={`aboutMe ${lowerCaseMode}ModeElement`}
        >
          {/* Picture icon for About Me */}
          <span className={`picture ${picture}`}></span>ABOUT ME
        </div>
      </nav>
      {/* Menu component */}
      <Menu
        active={active}
        sectionsList={sectionsList}
        controlFunction={controlMenu}
        mode={mode}
      />
      {/* AboutSection component */}
      <AboutSection
        active={activeAbout}
        controlFunction={controlAboutMe}
        mode={mode}
      />
    </React.Fragment>
  );
}

export { NavBar };
