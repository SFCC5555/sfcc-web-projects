import '../styles/Filter.css';
import data from '../data.json';
import { useState } from 'react';

function Filter( {mode} ) {

    const lowerCaseMode=mode.toLowerCase();

    let [activeFilterSkillsContainer, setActiveFilterSkillsContainer] = useState(false);

    let overAllSkillSet = new Set(data.projects.map(project=>project.skillList).join().split(','));

    let overAllSkillList = [...overAllSkillSet];

    overAllSkillList = overAllSkillList.map(skill=>skill.replaceAll('-',' '))

    function renderFilterMenu() {
        activeFilterSkillsContainer?setActiveFilterSkillsContainer(false):setActiveFilterSkillsContainer(true);
        
    }

    return (
        <button onClick={renderFilterMenu} className={`${lowerCaseMode}ModeFilter filterButton`}>filter<span className={`filterIcon${mode} filterIcon`} />
            <div className={`${lowerCaseMode}ModeComponent filterSkillsContainer ${activeFilterSkillsContainer?'':'inactive'}`}>
           
                {overAllSkillList.map(skill=>(<div className={`${lowerCaseMode}ModeElement filterSkill`} key={skill}>
                                            {skill}
                                        </div>))
                 }
            </div>
        </button>
    )
}

export { Filter };