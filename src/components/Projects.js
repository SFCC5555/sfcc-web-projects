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

        let filterSkillIcon = document.getElementById('filterSkillIcon');

        filterSkillIcon.classList.value=`inactive`;

        let optionsList = document.querySelectorAll('.filterSkill');

        optionsList.forEach(option=>option.classList.remove('selectFilterSkill'));

        let searchInputValue = document.getElementById('search').value.trim();

        let regularExpresion = new RegExp(searchInputValue,'i')

        let searchProjects = data.projects.filter(project=>regularExpresion.test(project.name));

        setProjects(searchProjects);

    }

    function filterFunction(event) {

        let searchInputValue = document.getElementById('search');

        searchInputValue.value='';

        let optionsList = document.querySelectorAll('.filterSkill');

        optionsList.forEach(option=>option.classList.remove('selectFilterSkill'));

        let option=event.target.innerText.replaceAll(' ','-');

        let filterSkillIcon = document.getElementById('filterSkillIcon');
    
        let filterProjects = data.projects.filter(project=>project.skillList.some(skill=>skill===option));

        if (option==='No-Filter') {
            
            filterSkillIcon.classList.value=`inactive`
            setProjects(data.projects);

        } else {
            filterSkillIcon.classList.value=`inactive`
            event.target.classList.add('selectFilterSkill');
            setTimeout(()=>{
                filterSkillIcon.classList.value=`filterSkillIcon ${option}Icon`;
            })
            
            setProjects(filterProjects);

        }
    }


    return (<main className='sectionContainer'>
                <div className='sectionGap' id='WEB PROJECTS'></div>
                <h2 className={`${lowerCaseMode}ModeElement`}>WEB PROJECTS</h2>
                <section className={`${lowerCaseMode}ModeElement searchFilterContainer`}>
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
                            <a href={project.link} target='_blank' rel="noreferrer" ><span className={`projectIllustration`} style={{backgroundImage:`url(${require(`../assets/images/projectIllustrations/${projectClass}Color.png`)})`}} /></a>
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