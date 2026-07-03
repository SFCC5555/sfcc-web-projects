import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.scss";
import { Menu } from "./Menu";
import { AboutSection } from "./AboutSection";
import { Mode } from "../types";
import { useAuth } from "../context/AuthContext";

interface NavBarProps {
  sectionsList: string[];
  mode: Mode;
}

function NavBar({ sectionsList, mode }: NavBarProps) {
  const [active, setActive] = useState(false);
  const [icon, setIcon] = useState("BurgerIcon");
  const [activeAbout, setActiveAbout] = useState(false);
  const [picture, setPicture] = useState("sfccPictureBW");
  const { session } = useAuth();

  const lowerCaseMode = mode.toLowerCase();

  function controlMenu() {
    active ? setActive(false) : setActive(true);
    icon === "BurgerIcon" ? setIcon("SIcon") : setIcon("BurgerIcon");
    setActiveAbout(false);
    setPicture("sfccPictureBW");
  }

  function controlAboutMe() {
    activeAbout ? setActiveAbout(false) : setActiveAbout(true);
    picture === "sfccPicture"
      ? setPicture("sfccPictureBW")
      : setPicture("sfccPicture");
    setActive(false);
    setIcon("BurgerIcon");
  }

  return (
    <React.Fragment>
      <nav className={`navBar ${lowerCaseMode}ModeComponent`}>
        <span
          onClick={controlMenu}
          className={`${icon} ${lowerCaseMode}${icon}`}
        />
        <a href="." className={`sFernando ${lowerCaseMode}ModeElement`}>
          ING. S. FERNANDO CARRASCO
        </a>
        <div className="navBarRight">
          {session && (
            <Link to="/admin" className={`navAdminLink ${lowerCaseMode}ModeElement`}>
              ADMIN
            </Link>
          )}
          <div
            onClick={controlAboutMe}
            className={`aboutMe ${lowerCaseMode}ModeElement`}
          >
            <span className={`picture ${picture}`} />ABOUT ME
          </div>
        </div>
      </nav>
      <Menu
        active={active}
        sectionsList={sectionsList}
        controlFunction={controlMenu}
        mode={mode}
      />
      <AboutSection
        active={activeAbout}
        controlFunction={controlAboutMe}
        mode={mode}
      />
    </React.Fragment>
  );
}

export { NavBar };
