import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';

/**
 * A component to protect routes from unauthenticated users.
 * It can also check for specific roles.
 * @param {{ allowedRoles: string[] }} props - The roles allowed to access the route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to the login page, but save the location they were trying to go to
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the route requires specific roles and if the user has one of them
  const hasRequiredRole = allowedRoles ? allowedRoles.includes(user?.role) : true;

  if (!hasRequiredRole) {
    // Redirect to a generic "unauthorized" page or home page
    // For now, we'll just redirect to home.
    return <Navigate to="/" replace />;
  }

  // 3. If all checks pass, render the child route
  return <Outlet />;
};

export default ProtectedRoute;
