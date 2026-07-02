import "./App.scss";
import React, { useState } from "react";
import { NavBar } from "./components/NavBar";
import { DarkModeButton } from "./components/DarkModeButton";
import { Projects } from "./components/Projects";
import { Certifications } from "./components/Certifications";
import { Form } from "./components/Form";
import { Mode } from "./types";

const stored = localStorage.getItem("mode");
let storageMode: Mode = stored === "Dark" ? "Dark" : "Light";

storageMode === "Light"
  ? document.body.classList.add("lightMode")
  : document.body.classList.remove("lightMode");

function App() {
  const sectionsList = ["WEB PROJECTS", "CERTIFICATIONS", "CONTACT"];
  const [mode, setMode] = useState<Mode>(storageMode);

  function controlDarkMode() {
    mode === "Light" ? setMode("Dark") : setMode("Light");
    document.body.classList.toggle("lightMode");
  }

  localStorage.setItem("mode", mode);

  return (
    <React.Fragment>
      <NavBar sectionsList={sectionsList} mode={mode} />
      <img
        alt="sfcc Icon"
        className="sfccIcon"
        src={require(`./assets/icons/sfccIcon${mode}.png`)}
      />
      <DarkModeButton controlFunction={controlDarkMode} mode={mode} />
      <Projects mode={mode} />
      <Certifications mode={mode} />
      <Form mode={mode} />
    </React.Fragment>
  );
}

export default App;
