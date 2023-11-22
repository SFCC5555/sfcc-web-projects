// Importing the necessary styles
import React from "react";
import "../styles/Menu.scss";

// Functional component for the navigation menu
function Menu({ sectionsList, active, controlFunction, mode }) {
  // Converting the mode to lowercase for class names
  let lowerCaseMode = mode.toLowerCase();

  // Function to close the menu when a section is selected (on small screens)
  function closeMenu() {
    if (window.innerWidth < 900) {
      controlFunction();
    }
  }

  return (
    <section
      className={
        active
          ? `menu ${lowerCaseMode}ModeComponent`
          : `menu ${lowerCaseMode}ModeComponent inactive`
      }
    >
      {/* Close button for the menu */}
      <div
        onClick={controlFunction}
        className={`closeIcon ${lowerCaseMode}ModeElement`}
      >
        X
      </div>

      {/* Generating navigation links for each section */}
      {sectionsList.map((section) => (
        <a
          onClick={closeMenu}
          href={`#${section}`}
          className={`${lowerCaseMode}ModeElement`}
          key={section}
        >
          {section}
        </a>
      ))}
    </section>
  );
}

export { Menu };
