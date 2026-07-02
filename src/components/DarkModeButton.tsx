import "../styles/DarkModeButton.scss";
import { Mode } from "../types";

interface DarkModeButtonProps {
  controlFunction: () => void;
  mode: Mode;
}

function DarkModeButton({ controlFunction, mode }: DarkModeButtonProps) {
  return (
    <span
      onClick={controlFunction}
      className={`darkModeButton darkModeButton${mode}`}
    ></span>
  );
}

export { DarkModeButton };
