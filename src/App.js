// Import necessary styles and components
import "./App.scss";
import React from "react";
import { NavBar } from "./components/NavBar.js";
import { DarkModeButton } from "./components/DarkModeButton";
import { Projects } from "./components/Projects";
import { useState } from "react";
import { Certifications } from "./components/Certifications";
import { Form } from "./components/Form";
// Get the body element
const body = document.querySelector("body");

// Check for stored mode preference or default to 'Light'
let storageMode = localStorage.getItem("mode")
  ? localStorage.getItem("mode")
  : "Light";

// Apply 'lightMode' class to body if mode is 'Light', remove otherwise
storageMode === "Light"
  ? body.classList.add("lightMode")
  : body.classList.remove("lightMode");

function App() {
  // Define sections for the navigation bar
  const sectionsList = ["WEB PROJECTS", "CERTIFICATIONS", "CONTACT"];

  // Initialize mode state with the stored mode preference
  let [mode, setMode] = useState(storageMode);

  // Function to toggle between Dark and Light mode
  function controlDarkMode() {
    mode === "Light" ? setMode("Dark") : setMode("Light");
    body.classList.toggle("lightMode");
  }

  // Store the selected mode preference
  localStorage.setItem("mode", mode);

  return (
    <React.Fragment>
      {/* Render the navigation bar */}
      <NavBar sectionsList={sectionsList} mode={mode} />

      {/* Render an icon */}
      <img
        alt="sfcc Icon"
        className="sfccIcon"
        src={require(`./assets/icons/sfccIcon${mode}.png`)}
      />

      {/* Render the Dark Mode button */}
      <DarkModeButton controlFunction={controlDarkMode} mode={mode} />

      {/* Render the Projects component */}
      <Projects mode={mode} />

      {/* Render the Certifications component */}
      <Certifications mode={mode} />

      {/* Render the Form component */}
      <Form mode={mode} />
    </React.Fragment>
  );
}

// Export the App component as the default export
export default App;
