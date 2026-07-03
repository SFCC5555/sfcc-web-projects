import "../App.scss";
import React from "react";
import { Link } from "react-router-dom";
import { NavBar } from "./NavBar";
import { DarkModeButton } from "./DarkModeButton";
import { Projects } from "./Projects";
import { Certifications } from "./Certifications";
import { Form } from "./Form";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Portfolio() {
  const sectionsList = ["WEB PROJECTS", "CERTIFICATIONS", "CONTACT"];
  const { mode } = useTheme();
  const { session } = useAuth();

  return (
    <React.Fragment>
      <NavBar sectionsList={sectionsList} mode={mode} />
      <img
        alt="sfcc Icon"
        className="sfccIcon"
        src={require(`../assets/icons/sfccIcon${mode}.png`)}
      />
      <DarkModeButton />
      {session && (
        <Link to="/admin" className="adminLink">
          Admin
        </Link>
      )}
      <Projects mode={mode} />
      <Certifications mode={mode} />
      <Form mode={mode} />
    </React.Fragment>
  );
}

export { Portfolio };
