import '../styles/Filter.css';

function Filter( {mode} ) {

    const lowerCaseMode=mode.toLowerCase();

    return (
        <button className={`${lowerCaseMode}ModeFilter filterButton`}>filter<span className={`filterIcon${mode} filterIcon`} /></button>
    )
}

export { Filter };