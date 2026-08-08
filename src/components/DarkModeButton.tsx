import "../styles/DarkModeButton.scss";
import { useTheme } from "../context/ThemeContext";

function DarkModeButton() {
  const { mode, controlDarkMode } = useTheme();
  return (
    <span
      onClick={controlDarkMode}
      className={`darkModeButton darkModeButton${mode}`}
    />
  );
}

export { DarkModeButton };
