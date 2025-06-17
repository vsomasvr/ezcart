import React, { useState, useEffect } from 'react';
import { View } from '../types'; // Import View type

interface NavbarProps {
  onShowList: () => void;
  onSearch: (keyword: string) => void;
  currentSearchTerm?: string;
  cartItemCount: number;
  onShowCartView: () => void;
  currentUser: string | null;
  currentView: View; // Added currentView prop
}

const Navbar: React.FC<NavbarProps> = ({ 
  onShowList, 
  onSearch, 
  currentSearchTerm, 
  cartItemCount, 
  onShowCartView,
  currentUser,
  currentView // Destructure currentView
}) => {
  const [searchInput, setSearchInput] = useState(currentSearchTerm || '');

  useEffect(() => {
    setSearchInput(currentSearchTerm || '');
  }, [currentSearchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };
  
  const handleHomeClick = () => {
    onSearch(''); 
    onShowList();
  };

  return (
    <nav className="bg-slate-950 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div 
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 cursor-pointer order-1"
            onClick={handleHomeClick}
            role="button"
            aria-label="Go to homepage"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleHomeClick()}
          >
            <i className="fas fa-store mr-2"></i>EZCart 
          </div>

          {currentView !== 'signIn' && (
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex w-full sm:w-auto order-3 sm:order-2 sm:flex-grow max-w-lg mx-auto sm:mx-0"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="px-4 py-2 rounded-l-md border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none w-full sm:w-64 md:w-80 transition-colors duration-200 flex-grow"
                aria-label="Search products by keyword"
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-r-md transition-colors duration-200"
                aria-label="Submit search"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          )}

          <div className={`flex items-center gap-3 sm:gap-4 order-2 sm:order-3 ${currentView === 'signIn' ? 'ml-auto' : 'ml-auto sm:ml-0'}`}>
            {currentUser ? (
              <>
                <span className="text-sm text-slate-300 hidden md:block">Welcome, <span className="font-semibold text-emerald-400">{currentUser}</span></span>
                <a
                  href="/logout"
                  className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow transition-colors no-underline"
                  title="Sign Out"
                  aria-label="Sign out"
                >
                  <i className="fas fa-sign-out-alt mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Sign Out</span>
                </a>
              </>
            ) : (
              <a
                href="/oauth2/authorization/ezcart-web"
                className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow transition-colors no-underline"
                title="Sign In"
                aria-label="Sign in"
              >
                <i className="fas fa-sign-in-alt mr-1 sm:mr-2"></i>
                Sign In
              </a>
            )}
            {currentView !== 'signIn' && (
              <button 
                onClick={onShowCartView}
                className="relative cursor-pointer group p-2 rounded-full hover:bg-slate-700 transition-colors" 
                title="View Cart"
                aria-label={`View Cart, ${cartItemCount} items`}
              >
                <i className="fas fa-shopping-cart text-xl text-slate-300 group-hover:text-cyan-400 transition-colors"></i>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
