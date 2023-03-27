import '../styles/Projects.css';
import projects from '../projects.json';
import { Skills } from './Skills';


function Projects({mode}) {

    const lowerCaseMode=mode.toLowerCase();


    return (<main>
                <h2 className={`${lowerCaseMode}ModeElement`}>WEB PROJECTS</h2>
                <section>

                </section>
                <section className='projectContainer'>
                    
                    {
                     projects.map(project=>(
                        <div key={project.name} className={`${lowerCaseMode}ModeComponent project`}>
                            <a href={project.link} target='_blank' rel="noreferrer" ><span className={`projectIlustration ${project.name}`} /></a>
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