import "../styles/Certifications.scss";
import data from "../data.json";
import { useState } from "react";
import { Mode } from "../types";

interface CertificationsProps {
  mode: Mode;
}

function Certifications({ mode }: CertificationsProps) {
  const lowerCaseMode = mode.toLowerCase();

  const [srcCertification, setSrcCertification] = useState("");
  const [linkCertification, setLinkCertification] = useState("");
  const [activeCertification, setActiveCertification] = useState(false);

  function closeCertification() {
    setActiveCertification(false);
  }

  function renderCertification(event: React.MouseEvent<HTMLSpanElement>) {
    const target = event.currentTarget;
    const id = target.id;
    const link = target.dataset.link ?? "";

    setActiveCertification(false);
    setTimeout(() => {
      setSrcCertification(id);
      setLinkCertification(link);
      setActiveCertification(true);
    });
  }

  return (
    <main className="sectionContainer">
      <div className="sectionGap" id="CERTIFICATIONS"></div>
      <h2 className={`${lowerCaseMode}ModeElement`}>CERTIFICATIONS</h2>
      {activeCertification && (
        <div
          className={`${lowerCaseMode}ModeComponent renderCertificationContainer`}
        >
          <div
            onClick={closeCertification}
            className="closeIcon lightModeElement"
          >
            X
          </div>
          <a
            href={
              linkCertification[0] === "h"
                ? linkCertification
                : require(`../assets/documents/${linkCertification}`)
            }
            target="_Blank"
            rel="noreferrer"
          >
            <span className="externalLinkIcon" />
          </a>
          <img
            src={
              srcCertification
                ? require(`../assets/images/certificationIllustrations/${srcCertification}Color.png`)
                : ""
            }
            alt={srcCertification}
          />
        </div>
      )}
      <section className="certificationContainer">
        {data.certifications.map((certification) => (
          <div
            key={certification.name}
            className={`${lowerCaseMode}ModeComponent certification`}
          >
            <span
              onClick={renderCertification}
              data-link={certification.link}
              title={certification.date}
              id={certification.name}
              className="certificationIllustration"
              style={{
                backgroundImage: `url(${require(`../assets/images/certificationIllustrations/${certification.name}Color.png`)})`,
              }}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

export { Certifications };
