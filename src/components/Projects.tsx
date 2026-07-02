import "../styles/Projects.scss";
import data from "../data.json";
import { Skills } from "./Skills";
import { Search } from "./Search";
import { Filter } from "./Filter";
import { useState } from "react";
import { Info } from "./Info";
import { Mode, Project } from "../types";

interface ProjectsProps {
  mode: Mode;
}

function Projects({ mode }: ProjectsProps) {
  const lowerCaseMode = mode.toLowerCase();

  const [projects, setProjects] = useState<Project[]>(data.projects);

  function searchFunction() {
    const filterSkillIcon = document.getElementById("filterSkillIcon");
    if (filterSkillIcon) filterSkillIcon.classList.value = "inactive";

    const optionsList = document.querySelectorAll(".filterSkill");
    optionsList.forEach((option) =>
      option.classList.remove("selectFilterSkill")
    );

    const searchInput = document.getElementById("search") as HTMLInputElement;
    const searchInputValue = searchInput.value.trim();
    const regularExpresion = new RegExp(searchInputValue, "i");

    setProjects(
      data.projects.filter((project) => regularExpresion.test(project.name))
    );
  }

  function filterFunction(event: React.MouseEvent<HTMLDivElement>) {
    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.value = "";

    const optionsList = document.querySelectorAll(".filterSkill");
    optionsList.forEach((option) =>
      option.classList.remove("selectFilterSkill")
    );

    const target = event.target as HTMLElement;
    const option = target.innerText.replaceAll(" ", "-");
    const filterSkillIcon = document.getElementById("filterSkillIcon");

    const filterProjects = data.projects.filter((project) =>
      project.skillList.some((skill) => skill === option)
    );

    if (option === "No-Filter") {
      if (filterSkillIcon) filterSkillIcon.classList.value = "inactive";
      setProjects(data.projects);
    } else {
      if (filterSkillIcon) filterSkillIcon.classList.value = "inactive";
      target.classList.add("selectFilterSkill");

      setTimeout(() => {
        if (filterSkillIcon)
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
          const projectClassName = projectClass.join("");

          return (
            <div
              key={project.name}
              className={`${lowerCaseMode}ModeComponent project infoRelative`}
            >
              <a href={project.link} target="_blank" rel="noreferrer" title="Go to App">
                <span
                  className="projectIllustration"
                  style={{
                    backgroundImage: `url(${require(`../assets/images/projectIllustrations/${projectClassName}Color.png`)})`,
                  }}
                />
              </a>
              <Skills skillList={project.skillList} mode={mode} />
              <Info mode={mode} name={project.name} info={project.info} />
              {project.date && (
                <span
                  className={`projectDate ${lowerCaseMode}ModeElement`}
                  title={project.date}
                >
                  {project.date}
                </span>
              )}
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                  title="Frontend"
                >
                  <span className={`skillIcon gitHubIcon${mode} gitHubLink`} />
                </a>
              )}
              {project.backendRepository && (
                <a
                  href={project.backendRepository}
                  target="_blank"
                  rel="noreferrer"
                  title="Backend"
                >
                  <span
                    className={`skillIcon gitHubIcon${mode} gitHubBackendLink`}
                  />
                </a>
              )}
              {project.privateRepository && (
                <span
                  title={`Private ${project.privateRepository} Repository`}
                  className={`skillIcon gitHubIcon${mode} gitHubLink private`}
                />
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export { Projects };
