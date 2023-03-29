import '../styles/Filter.css';
import data from '../data.json';
import { useState } from 'react';

function Filter({ mode, handleFilter}) {

    const lowerCaseMode=mode.toLowerCase();

    let [activeFilterSkillsContainer, setActiveFilterSkillsContainer] = useState(false);

    let overAllSkillSet = new Set(data.projects.map(project=>project.skillList).join().split(','));

    let overAllSkillList = [...overAllSkillSet];

    overAllSkillList = overAllSkillList.map(skill=>skill.replaceAll('-',' '))

    overAllSkillList.push('No Filter')

    document.addEventListener('click',closeFilterMenu);

    function closeFilterMenu(event) {

        if (!(/(filter)(Button|Icon|Skill(sContainer)?)/.test(event.target.classList.value))) {
            setActiveFilterSkillsContainer(false);
        }

    }


    function renderFilterMenu(event) {

        if (!(/(filterSkill)(sContainer)?/.test(event.target.classList.value))) {
            activeFilterSkillsContainer?setActiveFilterSkillsContainer(false):setActiveFilterSkillsContainer(true);
        }
    
    }
    

    return (
        <button id='filterButton' onClick={renderFilterMenu} className={`${lowerCaseMode}ModeFilter filterButton`}>Filter<span id='filterIcon' onClick={renderFilterMenu} className={`filterIcon${mode} filterIcon`} />
            <div className={`${lowerCaseMode}ModeComponent filterSkillsContainer ${activeFilterSkillsContainer?'':'inactive'}`}>
                <div className={`closeIcon ${lowerCaseMode}ModeElement`}>X</div>
                {overAllSkillList.map(skill=>(<div onClick={handleFilter} className={`${lowerCaseMode}ModeElement filterSkill`} key={skill}>
                                            {skill}
                                        </div>))
                 }
            </div>
        </button>
    )
}

export { Filter };