import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowRoles }) {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
