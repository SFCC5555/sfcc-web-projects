import '../styles/Skills.css';


function Skills({ skillList, mode }) {

    return (
        <section className='skillContanier'>
            
            {skillList.map(skill=>(
                <span key={skill} className={`skillIcon ${skill}Icon${mode}`}></span>
            ))}


        </section>
    )
};

export { Skills };