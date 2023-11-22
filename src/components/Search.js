// Importing necessary styles
import "../styles/Search.scss";

// Functional component for the search input
function Search({ mode, handleChange }) {
  // Converting mode to lowercase for class names
  const lowerCaseMode = mode.toLowerCase();

  return (
    <div className="inputContainer">
      {/* Search input field */}
      <input
        type="text"
        required
        onChange={handleChange}
        id="search"
        className={`${lowerCaseMode}ModeInput searchInput`}
        placeholder="Search a project"
      />
      {/* Label for the search input */}
      <label htmlFor="search">
        {/* Search icon */}
        <span className={`${lowerCaseMode}SearchIcon searchIcon`} />
      </label>
    </div>
  );
}

export { Search };
