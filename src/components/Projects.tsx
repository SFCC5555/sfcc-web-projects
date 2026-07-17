import "../styles/Projects.scss";
import { supabase } from "../lib/supabase";
import { Skills } from "./Skills";
import { Search } from "./Search";
import { Filter } from "./Filter";
import { Sort, SortOrder } from "./Sort";
import { useState, useRef, useEffect } from "react";
import { Info } from "./Info";
import { Mode, Project, ProjectType } from "../types";

interface ProjectsProps {
  mode: Mode;
}

function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return "";
  if (!startDate) return endDate!;
  if (!endDate || startDate === endDate) return startDate;
  return `${startDate} - ${endDate}`;
}

function Projects({ mode }: ProjectsProps) {
  const lowerCaseMode = mode.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [activeType, setActiveType] = useState<"all" | ProjectType>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [techIcons, setTechIcons] = useState<Record<string, string>>({});
  const [activeFilterSkill, setActiveFilterSkill] = useState<string | null>(null);

  // allProjectsRef: full unfiltered list; filteredRef: after search/skill filter
  const allProjectsRef = useRef<Project[]>([]);
  const filteredRef = useRef<Project[]>([]);

  useEffect(() => {
    supabase.from("technologies").select("name, icon_url").order("sort_order").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(t => { map[t.name] = t.icon_url ?? ""; });
        setTechIcons(map);
      }
    });
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          const mapped: Project[] = data.map((p) => ({
            name: p.name,
            link: p.link,
            info: p.info,
            startDate: p.start_date ?? undefined,
            endDate: p.end_date ?? undefined,
            type: p.type as ProjectType,
            skillList: p.skill_list,
            repository: p.repository ?? undefined,
            backendRepository: p.backend_repository ?? undefined,
            repositoryPrivate: p.repository_private ?? false,
            backendRepositoryPrivate: p.backend_repository_private ?? false,
            coverUrl: p.cover_url ?? undefined,
          }));
          allProjectsRef.current = mapped;
          filteredRef.current = mapped;
          setProjects(mapped);
          setFilterSkills(
            [...new Set(mapped.flatMap((p) => p.skillList))].sort()
          );
        }
        setLoading(false);
      });
  }, []);

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
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return a.startDate.localeCompare(b.startDate);
    });
    if (order === "date-desc") return sorted.sort((a, b) => {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return b.startDate.localeCompare(a.startDate);
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
    setActiveFilterSkill(null);

    const optionsList = document.querySelectorAll(".filterSkill");
    optionsList.forEach((option) =>
      option.classList.remove("selectFilterSkill")
    );

    const searchInput = document.getElementById("search") as HTMLInputElement;
    const searchInputValue = searchInput.value.trim();
    const regularExpresion = new RegExp(searchInputValue, "i");

    const filtered = allProjectsRef.current.filter((project) =>
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

    const filterProjects = allProjectsRef.current.filter((project) =>
      project.skillList.some((skill) => skill === option)
    );

    if (option === "No-Filter") {
      if (filterSkillIcon) {
        filterSkillIcon.classList.value = "inactive";
        filterSkillIcon.removeAttribute("data-tooltip");
      }
      setActiveFilterSkill(null);
      filteredRef.current = allProjectsRef.current;
      setProjects(applySort(applyTypeFilter(allProjectsRef.current, activeType), sortOrder));
    } else {
      if (filterSkillIcon) filterSkillIcon.classList.value = "inactive";
      target.classList.add("selectFilterSkill");
      setActiveFilterSkill(option);

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
      <div className="typeFilterTabs">
        {(["all", "project", "company", "learning"] as const).map((type) => (
          <button
            key={type}
            onClick={() => typeFilterFunction(type)}
            className={`${lowerCaseMode}ModeComponent typeTab typeTab--${type}${
              activeType === type ? " activeTypeTab" : ""
            }`}
          >
            {type === "all"
              ? "All"
              : type === "project"
              ? "Projects"
              : type === "company"
              ? "Companies"
              : "Learning"}
          </button>
        ))}
      </div>
      <section className={`${lowerCaseMode}ModeElement searchFilterContainer`}>
        <Search mode={mode} handleChange={searchFunction} />
        <div className="sortFilterGroup">
          <Sort mode={mode} handleSort={sortFunction} />
          <Filter mode={mode} handleFilter={filterFunction} skillList={filterSkills} techIcons={techIcons} activeFilterSkill={activeFilterSkill} />
        </div>
      </section>

      {loading && (
        <p className={`noResults ${lowerCaseMode}ModeElement`}>Loading…</p>
      )}
      {!loading && projects.length === 0 && (
        <p className={`noResults ${lowerCaseMode}ModeComponent ${lowerCaseMode}ModeElement`}>
          {allProjectsRef.current.length === 0 ? "No projects yet." : "No projects match your search"}
        </p>
      )}
      <section className="projectContainer">
        {projects.map((project) => {
          return (
            <div
              key={project.name}
              className={`${lowerCaseMode}ModeComponent project infoRelative`}
            >
              <div className="projectImageWrapper">
                <a href={project.link} target="_blank" rel="noreferrer" data-tooltip="Go to App">
                  {project.coverUrl ? (
                    <span
                      className="projectIllustration"
                      style={{ backgroundImage: `url(${project.coverUrl})` }}
                    />
                  ) : (
                    <span className="projectIllustration projectIllustrationEmpty">
                      {project.name}
                    </span>
                  )}
                </a>
                <span className={`projectTypeBadge projectTypeBadge--${project.type}`}>
                  {project.type === "project" ? "Project" : project.type === "company" ? "Company" : "Learning"}
                </span>
              </div>
              <Skills skillList={project.skillList} mode={mode} techIcons={techIcons} activeSkill={activeFilterSkill} />
              <Info mode={mode} name={project.name} info={project.info} onDetails={() => setSelectedProject(project)} />
              {(project.startDate || project.endDate) && (
                <span
                  className={`projectDate ${lowerCaseMode}ModeElement`}
                  data-tooltip={formatDateRange(project.startDate, project.endDate)}
                >
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              )}
              {project.repositoryPrivate ? (
                <span
                  data-tooltip="Private Frontend Repository"
                  className={`skillIcon gitHubIcon${mode} gitHubLink private`}
                />
              ) : project.repository ? (
                <a href={project.repository} target="_blank" rel="noreferrer">
                  <span
                    data-tooltip="Frontend"
                    className={`skillIcon gitHubIcon${mode} gitHubLink`}
                  />
                </a>
              ) : null}
              {project.backendRepositoryPrivate ? (
                <span
                  data-tooltip="Private Backend Repository"
                  className={`skillIcon gitHubIcon${mode} gitHubBackendLink private`}
                />
              ) : project.backendRepository ? (
                <a href={project.backendRepository} target="_blank" rel="noreferrer">
                  <span
                    data-tooltip="Backend"
                    className={`skillIcon gitHubIcon${mode} gitHubBackendLink`}
                  />
                </a>
              ) : null}
            </div>
          );
        })}
      </section>
      {selectedProject && (
        <div className="projectModalOverlay" onClick={() => setSelectedProject(null)}>
          <div
            className={`projectModal ${lowerCaseMode}ModeComponent`}
            onClick={e => e.stopPropagation()}
          >
            <button className="closeIcon projectModalClose" onClick={() => setSelectedProject(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="projectModalHeader">
              <h3 className={`projectModalTitle ${lowerCaseMode}ModeElement`}>{selectedProject.name}</h3>
              <span className={`projectTypeBadge projectTypeBadge--${selectedProject.type}`}>
                {selectedProject.type === "project" ? "Project" : selectedProject.type === "company" ? "Company" : "Learning"}
              </span>
            </div>

            {(selectedProject.startDate || selectedProject.endDate) && (
              <p className={`projectModalDate ${lowerCaseMode}ModeElement`}>
                {formatDateRange(selectedProject.startDate, selectedProject.endDate)}
              </p>
            )}

            <p className={`projectModalInfo ${lowerCaseMode}ModeElement`}>{selectedProject.info}</p>

            <Skills skillList={selectedProject.skillList} mode={mode} techIcons={techIcons} />

            <div className="projectModalLinks">
              <a href={selectedProject.link} target="_blank" rel="noreferrer" className={`projectModalLink ${lowerCaseMode}ModeComponent`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open App
              </a>
              {selectedProject.repository && !selectedProject.repositoryPrivate && (
                <a href={selectedProject.repository} target="_blank" rel="noreferrer" className={`projectModalLink ${lowerCaseMode}ModeComponent`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ flexShrink: 0 }}>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Frontend Repo
                </a>
              )}
              {selectedProject.backendRepository && !selectedProject.backendRepositoryPrivate && (
                <a href={selectedProject.backendRepository} target="_blank" rel="noreferrer" className={`projectModalLink ${lowerCaseMode}ModeComponent`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ flexShrink: 0 }}>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Backend Repo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export { Projects };
