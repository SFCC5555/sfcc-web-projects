import "../styles/Projects.scss";
import data from "../data.json";
import { Skills } from "./Skills";
import { Search } from "./Search";
import { Filter } from "./Filter";
import { Sort, SortOrder } from "./Sort";
import { useState, useRef } from "react";
import { Info } from "./Info";
import { Mode, Project, ProjectType } from "../types";

interface ProjectsProps {
  mode: Mode;
}

function Projects({ mode }: ProjectsProps) {
  const lowerCaseMode = mode.toLowerCase();

  const allProjects = data.projects as Project[];
  const [projects, setProjects] = useState<Project[]>(allProjects);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [activeType, setActiveType] = useState<"all" | ProjectType>("all");
  const filteredRef = useRef<Project[]>(allProjects);

  function applyTypeFilter(list: Project[], type: "all" | ProjectType): Project[] {
    if (type === "all") return list;
    return list.filter((p) => p.type === type);
  }

  function typeFilterFunction(type: "all" | ProjectType) {
    setActiveType(type);
    setProjects(applySort(applyTypeFilter(filteredRef.current, type), sortOrder));
  }

  function applySort(list: Project[], order: SortOrder): Project[] {
    const sorted = [...list];
    if (order === "name-asc") return sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (order === "name-desc") return sorted.sort((a, b) => b.name.localeCompare(a.name));
    if (order === "date-asc") return sorted.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
    if (order === "date-desc") return sorted.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });
    return sorted;
  }

  function sortFunction(order: SortOrder) {
    setSortOrder(order);
    setProjects(applySort(applyTypeFilter(filteredRef.current, activeType), order));
  }

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

    const filtered = allProjects.filter((project) =>
      regularExpresion.test(project.name)
    );
    filteredRef.current = filtered;
    setProjects(applySort(applyTypeFilter(filtered, activeType), sortOrder));
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

    const filterProjects = allProjects.filter((project) =>
      project.skillList.some((skill) => skill === option)
    );

    if (option === "No-Filter") {
      if (filterSkillIcon) {
        filterSkillIcon.classList.value = "inactive";
        filterSkillIcon.removeAttribute("data-tooltip");
      }
      filteredRef.current = allProjects;
      setProjects(applySort(applyTypeFilter(allProjects, activeType), sortOrder));
    } else {
      if (filterSkillIcon) filterSkillIcon.classList.value = "inactive";
      target.classList.add("selectFilterSkill");

      setTimeout(() => {
        if (filterSkillIcon) {
          filterSkillIcon.classList.value = `filterSkillIcon ${
            option[0].toLowerCase() + option.slice(1)
          }Icon`;
          filterSkillIcon.setAttribute("data-tooltip", target.innerText);
        }
      });

      filteredRef.current = filterProjects;
      setProjects(applySort(applyTypeFilter(filterProjects, activeType), sortOrder));
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
        <div className="typeFilterTabs">
          {(["all", "project", "contribution"] as const).map((type) => (
            <button
              key={type}
              onClick={() => typeFilterFunction(type)}
              className={`${lowerCaseMode}ModeComponent typeTab${
                activeType === type ? " activeTypeTab" : ""
              }`}
            >
              {type === "all"
                ? "All"
                : type === "project"
                ? "Projects"
                : "Contributions"}
            </button>
          ))}
        </div>
        <div className="sortFilterGroup">
          <Sort mode={mode} handleSort={sortFunction} />
          <Filter mode={mode} handleFilter={filterFunction} />
        </div>
      </section>

      {projects.length === 0 && (
        <p className={`noResults ${lowerCaseMode}ModeComponent ${lowerCaseMode}ModeElement`}>
          No projects match your search
        </p>
      )}
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
              <a href={project.link} target="_blank" rel="noreferrer" data-tooltip="Go to App">
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
                  data-tooltip={project.date}
                >
                  {project.date}
                </span>
              )}
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    data-tooltip="Frontend"
                    className={`skillIcon gitHubIcon${mode} gitHubLink`}
                  />
                </a>
              )}
              {project.backendRepository && (
                <a
                  href={project.backendRepository}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    data-tooltip="Backend"
                    className={`skillIcon gitHubIcon${mode} gitHubBackendLink`}
                  />
                </a>
              )}
              {project.privateRepository && (
                <span
                  data-tooltip={`Private ${project.privateRepository} Repository`}
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
