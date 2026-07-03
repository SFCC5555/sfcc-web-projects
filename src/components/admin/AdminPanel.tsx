import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DarkModeButton } from "../DarkModeButton";
import "../../styles/admin/AdminPanel.scss";
import "../../styles/admin/AdminToast.scss";

type ToastType = "success" | "error";
interface Toast { type: ToastType; message: string }

function AdminPanel() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<Toast | null>(null);

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

  return (
    <div className="adminPage">
      <header className="adminHeader">
        <div className="adminHeaderLeft">
          <Link to="/" className="adminBackLink">
            ← Portfolio
          </Link>
          <h1 className="adminTitle">ADMIN PANEL</h1>
        </div>
        <div className="adminHeaderRight">
          <span className="adminEmail">{session?.user.email}</span>
          <button className="adminSignOut" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="adminMain">
        <div className="adminCard">
          <h2>Projects</h2>
          <p>Manage your portfolio projects</p>
          <button className="adminActionButton" disabled>Coming soon</button>
        </div>
        <div className="adminCard">
          <h2>Certifications</h2>
          <p>Manage your certifications</p>
          <button className="adminActionButton" disabled>Coming soon</button>
        </div>
      </main>

      {toast && (
        <div className={`adminToast adminToast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      <DarkModeButton />
    </div>
  );
}

export { AdminPanel };
