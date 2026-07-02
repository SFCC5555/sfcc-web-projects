import "../styles/Sort.scss";
import { useState } from "react";
import { Mode } from "../types";

export type SortOrder =
  | "default"
  | "name-asc"
  | "name-desc"
  | "date-asc"
  | "date-desc";

const OPTIONS: { label: string; value: SortOrder }[] = [
  { label: "Default", value: "default" },
  { label: "Name A → Z", value: "name-asc" },
  { label: "Name Z → A", value: "name-desc" },
  { label: "Date ↑", value: "date-asc" },
  { label: "Date ↓", value: "date-desc" },
];

interface SortProps {
  mode: Mode;
  handleSort: (order: SortOrder) => void;
}

function Sort({ mode, handleSort }: SortProps) {
  const lowerCaseMode = mode.toLowerCase();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<SortOrder>("default");

  document.addEventListener("click", closeSortMenu);

  function closeSortMenu(event: MouseEvent) {
    if (
      !/(sort)(Button|sContainer|Option)/.test(
        (event.target as HTMLElement).classList.value
      )
    ) {
      setOpen(false);
    }
  }

  function toggleMenu(event: React.MouseEvent<HTMLButtonElement>) {
    if (
      !/(sortsContainer|sortOption)/.test(
        (event.target as HTMLElement).classList.value
      )
    ) {
      setOpen((prev) => !prev);
    }
  }

  function select(value: SortOrder, event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    setCurrent(value);
    handleSort(value);
    setOpen(false);
  }

  return (
    <button
      onClick={toggleMenu}
      className={`${lowerCaseMode}ModeFilter sortButton`}
    >
      Sort
      <svg
        className="sortIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 2 L12 7 H4 Z" />
        <path d="M8 14 L4 9 H12 Z" />
      </svg>
      {open && (
        <div className={`${lowerCaseMode}ModeComponent sortsContainer`}>
          {OPTIONS.map((opt) => (
            <div
              key={opt.value}
              onClick={(e) => select(opt.value, e)}
              className={`${lowerCaseMode}ModeElement sortOption${
                current === opt.value ? " selectSortOption" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

export { Sort };
