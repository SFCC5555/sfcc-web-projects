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
        X
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
