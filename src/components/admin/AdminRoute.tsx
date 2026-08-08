import { useAuth } from "../../context/AuthContext";
import { Login } from "./Login";
import { AdminPanel } from "./AdminPanel";
import "../../styles/admin/Login.scss";

function AdminRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="adminLoadingScreen">
        <span className="adminLoadingSpinner" />
      </div>
    );
  }

  if (!session) return <Login />;
  return <AdminPanel />;
}

export { AdminRoute };
