import '../styles/Projects.css';
import data from '../data.json';
import { Skills } from './Skills';
import { Search } from './Search';
import { Filter} from './Filter';
import { useState } from 'react';


function Projects({mode}) {

    const lowerCaseMode=mode.toLowerCase();

    let [projects,setProjects] = useState(data.projects);

    function searchFunction() {

        let searchInputValue = document.getElementById('search').value.trim();

        let regularExpresion = new RegExp(searchInputValue,'i')

        let searchProjects = data.projects.filter(project=>regularExpresion.test(project.name));

        setProjects(searchProjects);

    }

    function filterFunction(event) {

        let searchInputValue = document.getElementById('search');

        searchInputValue.value='';

        let option=event.target.innerText.replaceAll(' ','-');

        let filterProjects = data.projects.filter(project=>project.skillList.some(skill=>skill===option));

        setProjects(filterProjects);
    }


    return (<main className='sectionContainer'>
                <div className='sectionGap' id='WEB PROJECTS'></div>
                <h2 className={`${lowerCaseMode}ModeElement`}>WEB PROJECTS</h2>
                <section className='searchFilterContainer'>
                    <Search mode={mode} handleChange={searchFunction}/>
                    <Filter mode={mode} handleFilter={filterFunction}/>
                </section>
                <section className='projectContainer'>
                    
                    {
                     projects.map(project=>{

                        let projectClass=project.name.split(' ');

                        projectClass[0] = projectClass[0].toLowerCase();

                        projectClass=projectClass.join('');

                     return (
                        <div key={project.name} className={`${lowerCaseMode}ModeComponent project`}>
                            <a href={project.link} target='_blank' rel="noreferrer" ><span className={`projectIllustration ${projectClass}`} /></a>
                            <Skills skillList={project.skillList} mode={mode}/>
                            <a href={project.repository} target='_blank' rel="noreferrer" ><span className={`skillIcon GitHubIcon${mode} gitHubLink `}/></a>
                        </div>
                     )})   
                    }

                </section>

            </main>
    
    )
};

export { Projects };