import { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import { logoutUser } from '../apis/auth.api.js';
import ThemeSwitcher from '../components/ThemeSwitcher';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const SellerLayout = () => {
  const { logout: logoutFromStore } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const renderNavLinks = (onClickHandler) => (
    <>
        <li><Link to="/dashboard/seller" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Dashboard</Link></li>
        <li><Link to="/seller/products" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Products</Link></li>
        <li><Link to="/seller/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Orders</Link></li>
        <li><Link to="/seller/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={onClickHandler}>Profile</Link></li>
        <li><button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-white">Logout</button></li>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard/seller" className="text-xl font-bold">Seller Dashboard</Link>
                
                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 items-center">
                    {renderNavLinks()}
                    <li><ThemeSwitcher /></li>
                </ul>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <ThemeSwitcher />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-4">
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center">
                    <button onClick={closeMobileMenu} className="absolute top-5 right-5 p-2"><CloseIcon /></button>
                    <ul className="flex flex-col items-center space-y-8 text-xl">
                        {renderNavLinks(closeMobileMenu)}
                    </ul>
                </div>
            )}
        </header>
        <main className="flex-grow container mx-auto p-4">
            <Outlet />
        </main>
    </div>
  );
};

export default SellerLayout;
