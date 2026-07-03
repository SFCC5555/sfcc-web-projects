import "../App.scss";
import React from "react";
import { NavBar } from "./NavBar";
import { DarkModeButton } from "./DarkModeButton";
import { Projects } from "./Projects";
import { Certifications } from "./Certifications";
import { Form } from "./Form";
import { useTheme } from "../context/ThemeContext";

function Portfolio() {
  const sectionsList = ["WEB PROJECTS", "CERTIFICATIONS", "CONTACT"];
  const { mode } = useTheme();

  return (
    <React.Fragment>
      <NavBar sectionsList={sectionsList} mode={mode} />
      <img
        alt="sfcc Icon"
        className="sfccIcon"
        src={require(`../assets/icons/sfccIcon${mode}.png`)}
      />
      <DarkModeButton />
      <Projects mode={mode} />
      <Certifications mode={mode} />
      <Form mode={mode} />
    </React.Fragment>
  );
}

export { Portfolio };
