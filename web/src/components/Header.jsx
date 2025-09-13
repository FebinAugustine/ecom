import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import { logoutUser } from '../apis/auth.api.js';
import ThemeSwitcher from './ThemeSwitcher';

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const Header = () => {
  const { isAuthenticated, user, logout: logoutFromStore } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = user?.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
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
      case 'ADMIN': return '/dashboard/admin';
      case 'SELLER': return '/dashboard/seller';
      case 'USER': return '/dashboard/user';
      default: return '/';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    switch (user.role) {
        case 'ADMIN': return '/admin/profile';
        case 'USER': return '/user/profile';
        default: return '/';
    }
  };

  const renderNavLinks = (onClickHandler) => (
    <>
        <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Home</Link></li>
        <li><Link to="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Products</Link></li>
        {isAuthenticated ? (
            <>
                <li><Link to={getDashboardLink()} className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Dashboard</Link></li>
                <li><Link to={getProfileLink()} className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Profile</Link></li>
                {user.role === 'USER' && (
                    <>
                        <li><Link to="/wishlist" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Wishlist</Link></li>
                        <li>
                            <Link to="/cart" className="relative flex items-center hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>
                                <CartIcon />
                                {cartItemCount > 0 && <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{cartItemCount}</span>}
                            </Link>
                        </li>
                    </>
                )}
                <li><button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-white">Logout</button></li>
            </>
        ) : (
            <>
                <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Login</Link></li>
                <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Register</Link></li>
            </>
        )}
    </>
  );

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">EcomMERN</Link>
        
        <ul className="hidden md:flex space-x-6 items-center">
            {renderNavLinks()}
            <li><ThemeSwitcher /></li>
        </ul>

        <div className="md:hidden flex items-center">
            <ThemeSwitcher />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-4">
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center">
            <button onClick={closeMobileMenu} className="absolute top-5 right-5 p-2"><CloseIcon /></button>
            <ul className="flex flex-col items-center space-y-8 text-xl">
                {renderNavLinks(closeMobileMenu)}
            </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
