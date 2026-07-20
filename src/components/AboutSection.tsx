import { useState, useEffect } from "react";
import "../styles/AboutSection.scss";
import { Mode } from "../types";
import { supabase } from "../lib/supabase";

interface AboutSectionProps {
  active: boolean;
  controlFunction: () => void;
  mode: Mode;
}

interface AboutData {
  description: string;
  skill_list: string[];
  github_url: string;
  linkedin_url: string;
  cv_url: string | null;
}

function AboutSection({ active, controlFunction, mode }: AboutSectionProps) {
  const lowerCaseMode = mode.toLowerCase();
  const [about, setAbout] = useState<AboutData | null>(null);
  useEffect(() => {
    supabase
      .from("about")
      .select("description, skill_list, github_url, linkedin_url, cv_url")
      .single()
      .then(({ data }) => {
        if (data) setAbout(data as AboutData);
      });
  }, []);

  const description = about?.description ?? "";
  const githubUrl = about?.github_url ?? "";
  const linkedinUrl = about?.linkedin_url ?? "";
  const cvUrl = about?.cv_url ?? "";

  return (
    <section
      className={
        active
          ? `aboutSection ${lowerCaseMode}ModeComponent`
          : `aboutSection ${lowerCaseMode}ModeComponent inactive`
      }
    >
      <div
        onClick={controlFunction}
        className={`closeIcon ${lowerCaseMode}ModeElement`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <p className={`${lowerCaseMode}ModeElement paragraph`}>
        {description}
      </p>

      <section className="links">
        <div>
          {githubUrl && (
            <a href={githubUrl} className={`${lowerCaseMode}ModeElement`} target="_Blank" rel="noreferrer">
              <span className={`skillIcon gitHubIcon${mode}`} />
              GitHub
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} className={`${lowerCaseMode}ModeElement`} target="_Blank" rel="noreferrer">
              <span className={`skillIcon linkedinIcon${mode}`} />
              Linkedin
            </a>
          )}
          {cvUrl && (
            <a href={cvUrl} className={`${lowerCaseMode}ModeElement`} target="_Blank" rel="noreferrer">
              <span className={`skillIcon cvIcon${mode}`} />
              CV
            </a>
          )}
        </div>
      </section>
    </section>
  );
}

export { AboutSection };
