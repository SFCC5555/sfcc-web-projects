import '../styles/Skills.scss';


function Skills({ skillList, mode, noWarp }) {

    return (
        <section className={`skillContainer ${noWarp}`}>
            
            {skillList.map(skill=>(
                <span key={skill} title={skill} className={`skillIcon ${skill[0].toLowerCase()+skill.slice(1)}Icon${mode}`}></span>
            ))}


        </section>
    )
};

Skills.defaultProps = {noWarp:'warp'}

export { Skills };