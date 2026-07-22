import React, { useState } from "react";
import "../styles/Info.scss";
import { Mode } from "../types";

interface InfoProps {
  mode: Mode;
  name: string;
  info: string;
  onDetails?: () => void;
}

function Info({ mode, name, info, onDetails }: InfoProps) {
  const [activeInfo, setActiveInfo] = useState(false);

  function aboutInfo() {
    setActiveInfo(true);
  }

  function closeAboutInfo() {
    setActiveInfo(false);
  }

  return (
    <>
      <span
        onMouseLeave={closeAboutInfo}
        onMouseEnter={aboutInfo}
        onClick={() => setActiveInfo(v => !v)}
        className={`skillIcon aboutIcon${mode} aboutIcon`}
      />
      {activeInfo && (
        <div
          className={`info info${mode}`}
          onMouseEnter={aboutInfo}
          onMouseLeave={closeAboutInfo}
          onClick={e => e.stopPropagation()}
        >
          <div className="infoTitle">{name}</div>
          <p className="infoContent">{info}</p>
          {onDetails && (
            <button className="infoDetailsBtn" onClick={onDetails}>
              Detail
            </button>
          )}
        </div>
      )}
    </>
  );
}

export { Info };
