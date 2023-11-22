// Importing required styles and data
import "../styles/Projects.scss";
import data from "../data.json";
import { Skills } from "./Skills";
import { Search } from "./Search";
import { Filter } from "./Filter";
import { useState } from "react";
import { Info } from "./Info";

// Functional component to display projects
function Projects({ mode }) {
  // Convert mode to lowercase
  const lowerCaseMode = mode.toLowerCase();

  // State to manage projects
  let [projects, setProjects] = useState(data.projects);

  // Function to perform project search
  function searchFunction() {
    let filterSkillIcon = document.getElementById("filterSkillIcon");
    filterSkillIcon.classList.value = `inactive`;

    let optionsList = document.querySelectorAll(".filterSkill");
    optionsList.forEach((option) =>
      option.classList.remove("selectFilterSkill")
    );

    let searchInputValue = document.getElementById("search").value.trim();
    let regularExpresion = new RegExp(searchInputValue, "i");

    let searchProjects = data.projects.filter((project) =>
      regularExpresion.test(project.name)
    );
    setProjects(searchProjects);
  }

  // Function to filter projects based on selected skill
  function filterFunction(event) {
    let searchInputValue = document.getElementById("search");
    searchInputValue.value = "";

    let optionsList = document.querySelectorAll(".filterSkill");
    optionsList.forEach((option) =>
      option.classList.remove("selectFilterSkill")
    );

    let option = event.target.innerText.replaceAll(" ", "-");
    let filterSkillIcon = document.getElementById("filterSkillIcon");

    let filterProjects = data.projects.filter((project) =>
      project.skillList.some((skill) => skill === option)
    );

    if (option === "No-Filter") {
      filterSkillIcon.classList.value = `inactive`;
      setProjects(data.projects);
    } else {
      filterSkillIcon.classList.value = `inactive`;
      event.target.classList.add("selectFilterSkill");

      setTimeout(() => {
        filterSkillIcon.classList.value = `filterSkillIcon ${
          option[0].toLowerCase() + option.slice(1)
        }Icon`;
      });

      setProjects(filterProjects);
    }
  }

  return (
    <main className="sectionContainer">
      <div className="sectionGap" id="WEB PROJECTS"></div>
      <h2 className={`${lowerCaseMode}ModeElement`}>
        WEB PROJECTS & CONTRIBUTIONS
      </h2>
      <section className={`${lowerCaseMode}ModeElement searchFilterContainer`}>
        <Search mode={mode} handleChange={searchFunction} />
        <Filter mode={mode} handleFilter={filterFunction} />
      </section>
      <section className="projectContainer">
        {projects.map((project) => {
          let projectClass = project.name.split(" ");
          projectClass[0] = projectClass[0].toLowerCase();
          projectClass = projectClass.join("");

          return (
            <div
              key={project.name}
              className={`${lowerCaseMode}ModeComponent project infoRelative`}
            >
              <a href={project.link} target="_blank" rel="noreferrer">
                <span
                  className={`projectIllustration`}
                  title={project.date}
                  style={{
                    backgroundImage: `url(${require(`../assets/images/projectIllustrations/${projectClass}Color.png`)})`,
                  }}
                />
              </a>
              <Skills skillList={project.skillList} mode={mode} />
              <Info mode={mode} name={project.name} info={project.info} />
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                  title={`Frontend ${
                    project.repository === "private repository"
                      ? "( private repository )"
                      : ""
                  }`}
                >
                  <span
                    className={`skillIcon gitHubIcon${mode} gitHubLink ${
                      project.repository === "private repository" && "private"
                    }`}
                  />
                </a>
              )}
              {project.backendRepository && (
                <a
                  href={project.backendRepository}
                  target="_blank"
                  rel="noreferrer"
                  title={`Backend ${
                    project.backendRepository === "private repository"
                      ? "( private repository )"
                      : ""
                  }`}
                >
                  <span
                    className={`skillIcon gitHubIcon${mode} gitHubBackendLink ${
                      project.backendRepository === "private repository" &&
                      "private"
                    }`}
                  />
                </a>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export { Projects };
