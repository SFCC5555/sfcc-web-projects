import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DarkModeButton } from "../DarkModeButton";
import { AdminProjects, ProjectsHandle } from "./AdminProjects";
import { AdminCertifications, CertificationsHandle } from "./AdminCertifications";
import { AdminTechnologies, TechnologiesHandle } from "./AdminTechnologies";
import "../../styles/admin/AdminPanel.scss";
import "../../styles/admin/AdminToast.scss";

type Tab = "projects" | "certifications" | "technologies";
type ToastType = "success" | "error";
interface Toast { type: ToastType; message: string }

const TAB_LABELS: Record<Tab, string> = {
  projects: "Projects",
  certifications: "Certifications",
  technologies: "Technologies",
};

function AdminPanel() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [toast, setToast] = useState<Toast | null>(null);

  const projectsRef = useRef<ProjectsHandle>(null);
  const certsRef = useRef<CertificationsHandle>(null);
  const techsRef = useRef<TechnologiesHandle>(null);

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    const pending = sessionStorage.getItem("sfcc_admin_toast");
    if (pending) {
      sessionStorage.removeItem("sfcc_admin_toast");
      const { type, message } = JSON.parse(pending) as Toast;
      showToast(type, message);
    }
  }, []);

  async function handleSignOut() {
    sessionStorage.setItem(
      "sfcc_admin_toast",
      JSON.stringify({ type: "success", message: "Signed out successfully" })
    );
    await signOut();
    navigate("/admin");
  }

  function handleAdd() {
    if (activeTab === "projects") projectsRef.current?.openAdd();
    else if (activeTab === "certifications") certsRef.current?.openAdd();
    else techsRef.current?.openAdd();
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab);
  }

  return (
    <div className="adminPage">
      <header className="adminHeader">
        <div className="adminHeaderLeft">
          <Link to="/" className="adminBackLink">← Portfolio</Link>
          <h1 className="adminTitle">ADMIN PANEL</h1>
        </div>
        <div className="adminHeaderRight">
          <span className="adminEmail">{session?.user.email}</span>
          <button className="adminSignOut" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      <div className="adminTabBar">
        <div className="adminTabs">
          {(["projects", "certifications", "technologies"] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`adminTab${activeTab === tab ? " adminTab--active" : ""}`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <button className="adminAddBtn" onClick={handleAdd}>
          + Add {TAB_LABELS[activeTab].replace(/s$/, "")}
        </button>
      </div>

      <div className="adminContent">
        {activeTab === "projects" && <AdminProjects ref={projectsRef} onToast={showToast} />}
        {activeTab === "certifications" && <AdminCertifications ref={certsRef} onToast={showToast} />}
        {activeTab === "technologies" && <AdminTechnologies ref={techsRef} onToast={showToast} />}
      </div>

      {toast && (
        <div className={`adminToast adminToast--${toast.type}`}>{toast.message}</div>
      )}

      <DarkModeButton />
    </div>
  );
}

export { AdminPanel };
