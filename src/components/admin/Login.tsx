import { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { DarkModeButton } from "../DarkModeButton";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/admin/Login.scss";
import "../../styles/admin/AdminToast.scss";

type ToastType = "success" | "error";
interface Toast { type: ToastType; message: string }

function Login() {
  const { mode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      showToast("error", "Invalid credentials. Please try again.");
      return;
    }

    sessionStorage.setItem(
      "sfcc_admin_toast",
      JSON.stringify({ type: "success", message: "Signed in successfully" })
    );
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <img
          src={require(`../../assets/icons/sfccIcon${mode}.png`)}
          alt="SFCC"
          className="loginLogo"
        />
        <h1 className="loginTitle">ADMIN</h1>
        <p className="loginSubtitle">Portfolio management</p>

        <form className="loginForm" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="loginInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <Link to="/" className="loginBackLink">
          ← Back to portfolio
        </Link>
      </div>

      {toast && (
        <div className={`adminToast adminToast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      <DarkModeButton />
    </div>
  );
}

export { Login };
