import "../styles/Filter.scss";
import { useState } from "react";
import { Mode } from "../types";

interface FilterProps {
  mode: Mode;
  handleFilter: React.MouseEventHandler<HTMLDivElement>;
  skillList: string[];
}

function Filter({ mode, handleFilter, skillList }: FilterProps) {
  const lowerCaseMode = mode.toLowerCase();

  const [activeFilterSkillsContainer, setActiveFilterSkillsContainer] =
    useState(false);

  const overAllSkillList = [
    ...skillList.map((s) => s.replaceAll("-", " ")),
    "No Filter",
  ];

  document.addEventListener("click", closeFilterMenu);

  function closeFilterMenu(event: MouseEvent) {
    if (
      !/(filter)(Button|Icon|Skill(sContainer)?)/.test(
        (event.target as HTMLElement).classList.value
      )
    ) {
      setActiveFilterSkillsContainer(false);
    }
  }

  function renderFilterMenu(event: React.MouseEvent<HTMLButtonElement>) {
    if (!/(filterSkill)(sContainer)?/.test((event.target as HTMLElement).classList.value)) {
      activeFilterSkillsContainer
        ? setActiveFilterSkillsContainer(false)
        : setActiveFilterSkillsContainer(true);
    }
  }

  return (
    <button
      onClick={renderFilterMenu}
      className={`${lowerCaseMode}ModeFilter filterButton`}
    >
      Filter
      <span
        onClick={renderFilterMenu as unknown as React.MouseEventHandler<HTMLSpanElement>}
        className={`${lowerCaseMode}FilterIcon filterIcon`}
      />
      <span id="filterSkillIcon" className="inactive" />
      <div
        className={`${lowerCaseMode}ModeComponent filterSkillsContainer ${
          activeFilterSkillsContainer ? "" : "inactive"
        }`}
      >
        <div className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
        {overAllSkillList.map((skill) => (
          <div
            onClick={handleFilter}
            className={`${lowerCaseMode}ModeElement filterSkill`}
            key={skill}
          >
            {skill}
          </div>
        ))}
      </div>
    </button>
  );
}

export { Filter };
