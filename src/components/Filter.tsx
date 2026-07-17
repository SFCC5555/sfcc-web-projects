import "../styles/Filter.scss";
import { useState } from "react";
import { Mode } from "../types";

interface FilterProps {
  mode: Mode;
  handleFilter: React.MouseEventHandler<HTMLDivElement>;
  skillList: string[];
  techIcons?: Record<string, string>;
  activeFilterSkill?: string | null;
}

function Filter({ mode, handleFilter, skillList, techIcons = {}, activeFilterSkill }: FilterProps) {
  const lowerCaseMode = mode.toLowerCase();

  const [activeFilterSkillsContainer, setActiveFilterSkillsContainer] =
    useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const overAllSkillList = [
    "No Filter",
    ...skillList.map((s) => s.replaceAll("-", " ")),
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
      {(hoveredIcon || selectedIcon) && (
        <div className="filterSkillIconWrapper">
          <img key={hoveredIcon || selectedIcon} src={(hoveredIcon || selectedIcon)!} alt="" className="filterSkillIcon" />
        </div>
      )}
      <div
        className={`${lowerCaseMode}ModeComponent filterSkillsContainer ${
          activeFilterSkillsContainer ? "" : "inactive"
        }`}
      >
        <div className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
        {overAllSkillList.map((skill) => {
          const iconUrl = techIcons[skill] || techIcons[skill.replaceAll(" ", "-")];
          const isSelected = skill === "No Filter"
            ? !activeFilterSkill
            : activeFilterSkill === skill.replaceAll(" ", "-");

          return (
            <div
              onClick={(e) => {
                handleFilter(e as any);
                if (skill === "No Filter") {
                  setSelectedIcon(null);
                } else {
                  setSelectedIcon(iconUrl || null);
                }
              }}
              className={`${lowerCaseMode}ModeElement filterSkill${isSelected ? " selectFilterSkill" : ""}`}
              key={skill}
              onMouseEnter={() => setHoveredIcon(iconUrl || null)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              {skill}
            </div>
          );
        })}
      </div>
    </button>
  );
}

export { Filter };
