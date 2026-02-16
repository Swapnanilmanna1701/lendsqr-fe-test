import { Navigate } from "react-router-dom";
import { getFromLocalStorage } from "../utils/localStorage";

interface AuthData {
  email: string;
  isAuthenticated: boolean;
}

/**
 * Route guard that redirects unauthenticated users to /login.
 * Checks the `lendsqr_auth` entry in localStorage.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = getFromLocalStorage<AuthData>("lendsqr_auth");

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
