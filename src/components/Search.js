import '../styles/Search.css';

function Search({ mode, handleChange}) {

    const lowerCaseMode=mode.toLowerCase();

    return (
        <div className='inputContainer'>
            <input type='text' required onChange={handleChange} id='search' className={`${lowerCaseMode}ModeInput searchInput`} placeholder='search a project' />
            <label htmlFor='search'><span className={`searchIcon${mode} searchIcon`} /></label>
        </div>
    )
}

export { Search };