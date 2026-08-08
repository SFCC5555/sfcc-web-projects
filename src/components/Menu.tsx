import React from "react";
import "../styles/Menu.scss";
import { Mode } from "../types";

interface MenuProps {
  sectionsList: string[];
  active: boolean;
  controlFunction: () => void;
  mode: Mode;
}

function Menu({ sectionsList, active, controlFunction, mode }: MenuProps) {
  const lowerCaseMode = mode.toLowerCase();

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
      <div
        onClick={controlFunction}
        className={`closeIcon ${lowerCaseMode}ModeElement`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
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
