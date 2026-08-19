import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DarkModeButton } from "../DarkModeButton";
import { AdminProjects, ProjectsHandle } from "./AdminProjects";
import { AdminCertifications, CertificationsHandle } from "./AdminCertifications";
import { AdminTechnologies, TechnologiesHandle } from "./AdminTechnologies";
import { AdminAbout } from "./AdminAbout";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminTasks, TasksHandle } from "./AdminTasks";
import "../../styles/admin/AdminPanel.scss";
import "../../styles/admin/AdminToast.scss";

type Tab = "projects" | "certifications" | "technologies" | "about" | "tasks" | "analytics";
type ToastType = "success" | "error";
interface Toast { type: ToastType; message: string }

const TAB_LABELS: Record<Tab, string> = {
  projects: "Projects",
  certifications: "Certifications",
  technologies: "Technologies",
  about: "About",
  tasks: "Tasks",
  analytics: "Analytics",
};

function AdminPanel() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [toast, setToast] = useState<Toast | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const projectsRef = useRef<ProjectsHandle>(null);
  const certsRef = useRef<CertificationsHandle>(null);
  const techsRef = useRef<TechnologiesHandle>(null);
  const tasksRef = useRef<TasksHandle>(null);

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [mobileMenuOpen]);

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
    else if (activeTab === "technologies") techsRef.current?.openAdd();
    else if (activeTab === "tasks") tasksRef.current?.openAdd();
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
        {/* Desktop tab row */}
        <div className="adminTabs">
          {(["projects", "certifications", "technologies", "about", "tasks", "analytics"] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`adminTab${activeTab === tab ? " adminTab--active" : ""}`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Mobile dropdown menu */}
        <div className="adminMobileMenu" ref={mobileMenuRef}>
          <button
            className="adminMobileMenuBtn"
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            <span>{TAB_LABELS[activeTab]}</span>
            <span className="adminMobileMenuChevron">{mobileMenuOpen ? "▴" : "▾"}</span>
          </button>
          {mobileMenuOpen && (
            <div className="adminMobileMenuDropdown">
              {(["projects", "certifications", "technologies", "about", "tasks", "analytics"] as Tab[]).map(tab => (
                <button
                  key={tab}
                  className={`adminMobileMenuOption${activeTab === tab ? " adminMobileMenuOption--active" : ""}`}
                  onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab !== "about" && activeTab !== "analytics" && (
          <button className="adminAddBtn" onClick={handleAdd}>
            + Add {TAB_LABELS[activeTab].replace(/ies$/, "y").replace(/s$/, "")}
          </button>
        )}
      </div>

      <div className="adminContent">
        {activeTab === "projects" && <AdminProjects ref={projectsRef} onToast={showToast} />}
        {activeTab === "certifications" && <AdminCertifications ref={certsRef} onToast={showToast} />}
        {activeTab === "technologies" && <AdminTechnologies ref={techsRef} onToast={showToast} />}
        {activeTab === "about" && <AdminAbout onToast={showToast} />}
        {activeTab === "tasks" && <AdminTasks ref={tasksRef} />}
        {activeTab === "analytics" && <AdminAnalytics />}
      </div>

      {toast && (
        <div className={`adminToast adminToast--${toast.type}`}>{toast.message}</div>
      )}

      <DarkModeButton />
    </div>
  );
}

export { AdminPanel };
