import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function RequireRole({ allowedRoles, children }) {
  const location = useLocation();
  const role = useStore((state) => state.session.role);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
