import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const stored = localStorage.getItem("user");
  let user = null;
  try {
    user = stored ? JSON.parse(stored) : null;
  } catch {}

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
