import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import { logoutUser } from '../apis/auth.api.js';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const { isAuthenticated, user, logout: logoutFromStore } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logoutFromStore();
      navigate('/');
    }
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'SELLER':
        return '/dashboard/seller';
      case 'USER':
        return '/dashboard/user';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          EcomMERN
        </Link>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to={getDashboardLink()} className="hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-white">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Register</Link>
              </li>
            </>
          )}
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
