// Importing the required styles and data
import "../styles/Filter.scss";
import data from "../data.json";
import { useState } from "react";

// Functional component for the Filter
function Filter({ mode, handleFilter }) {
  const lowerCaseMode = mode.toLowerCase();

  // State to control the visibility of the filter skills container
  let [activeFilterSkillsContainer, setActiveFilterSkillsContainer] =
    useState(false);

  // Creating a set of all unique skills from project data
  let overAllSkillSet = new Set(
    data.projects
      .map((project) => project.skillList)
      .join()
      .split(",")
      .sort()
  );

  // Converting the set to an array
  let overAllSkillList = [...overAllSkillSet];

  // Replacing hyphens with spaces in skill names
  overAllSkillList = overAllSkillList.map((skill) =>
    skill.replaceAll("-", " ")
  );

  // Adding 'No Filter' option to the list
  overAllSkillList.push("No Filter");

  // Adding a click event listener to close the filter menu
  document.addEventListener("click", closeFilterMenu);

  function closeFilterMenu(event) {
    // Check if the click target is not part of the filter button or icon
    if (
      !/(filter)(Button|Icon|Skill(sContainer)?)/.test(
        event.target.classList.value
      )
    ) {
      setActiveFilterSkillsContainer(false);
    }
  }

  // Function to render the filter menu
  function renderFilterMenu(event) {
    // Check if the click target is not part of the filter skill container
    if (!/(filterSkill)(sContainer)?/.test(event.target.classList.value)) {
      // Toggle the visibility of the filter skills container
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
        onClick={renderFilterMenu}
        className={`${lowerCaseMode}FilterIcon filterIcon`}
      />
      <span id="filterSkillIcon" className={`inactive`} />
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
