import "../styles/Search.scss";
import { Mode } from "../types";

interface SearchProps {
  mode: Mode;
  handleChange: () => void;
}

function Search({ mode, handleChange }: SearchProps) {
  const lowerCaseMode = mode.toLowerCase();

  return (
    <div className="inputContainer">
      <input
        type="text"
        required
        onChange={handleChange}
        id="search"
        className={`${lowerCaseMode}ModeInput searchInput`}
        placeholder="Search a project"
      />
      <label htmlFor="search">
        <span className={`${lowerCaseMode}SearchIcon searchIcon`} />
      </label>
    </div>
  );
}

export { Search };
