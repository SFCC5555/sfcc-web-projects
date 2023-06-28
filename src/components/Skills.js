import '../styles/Skills.css';


function Skills({ skillList, mode, noWarp }) {

    return (
        <section className={`skillContainer ${noWarp}`}>
            
            {skillList.map(skill=>(
                <span key={skill} title={skill} className={`skillIcon ${skill}Icon${mode}`}></span>
            ))}


        </section>
    )
};

Skills.defaultProps = {noWarp:'warp'}

export { Skills };