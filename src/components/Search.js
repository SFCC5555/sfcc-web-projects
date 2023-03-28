import '../styles/Search.css';

function Search( {mode} ) {

    const lowerCaseMode=mode.toLowerCase();

    return (
        <div className='inputCpntainer'>
            <input id='search' className={`${lowerCaseMode}ModeInput searchInput`} type='text' placeholder='search a project' />
            <label htmlFor='search'><span className={`searchIcon${mode} searchIcon`} /></label>
        </div>
    )
}

export { Search };