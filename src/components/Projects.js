import '../styles/Projects.css';
import data from '../data.json';
import { Skills } from './Skills';
import { Search } from './Search';
import { Filter} from './Filter';


function Projects({mode}) {

    const lowerCaseMode=mode.toLowerCase();


    return (<main className='sectionContainer'>
                <div className='sectionGap' id='WEB PROJECTS'></div>
                <h2 className={`${lowerCaseMode}ModeElement`}>WEB PROJECTS</h2>
                <section className='searchFilterContainer'>
                    <Search mode={mode} />
                    <Filter mode={mode} />
                </section>
                <section className='projectContainer'>
                    
                    {
                     data.projects.map(project=>(
                        <div key={project.name} className={`${lowerCaseMode}ModeComponent project`}>
                            <a href={project.link} target='_blank' rel="noreferrer" ><span className={`projectIllustration ${project.name}`} /></a>
                            <Skills skillList={project.skillList} mode={mode}/>
                            <a href={project.repository} target='_blank' rel="noreferrer" ><span className={`skillIcon GitHubIcon${mode} gitHubLink `}/></a>
                        </div>
                     ))   
                    }

                </section>

            </main>
    
    )
};

export { Projects };