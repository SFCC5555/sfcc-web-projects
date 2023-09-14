// Importing the required styles
import '../styles/DarkModeButton.scss';

// Functional component for the Dark Mode Button
function DarkModeButton({ controlFunction, mode }) {
  return (
    // Button for toggling dark mode, controlled by controlFunction
    <span onClick={controlFunction} className={`darkModeButton darkModeButton${mode}`}></span>
  );
}

export { DarkModeButton };