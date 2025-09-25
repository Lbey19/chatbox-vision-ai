import { Navigate, useLocation } from "react-router-dom";

export default function GateGuard({ children }) {
  const passed = sessionStorage.getItem("site_gate_passed") === "1";
  const location = useLocation();

  
  if (!passed) {
    return <Navigate to="/gate" state={{ from: location }} replace />;
  }
  return children;
}
