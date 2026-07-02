import React, { useState } from "react";
import "../styles/Info.scss";
import { Mode } from "../types";

interface InfoProps {
  mode: Mode;
  name: string;
  info: string;
}

function Info({ mode, name, info }: InfoProps) {
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
        className={`skillIcon aboutIcon${mode} aboutIcon`}
      />
      {activeInfo && (
        <div className={`info info${mode}`}>
          <div className="infoTitle">{name}</div>
          <p className="infoContent">{info}</p>
        </div>
      )}
    </>
  );
}

export { Info };
