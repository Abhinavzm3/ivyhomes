import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, Building2, Key, Heart, BarChart2, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const links = [
    { to: '/listings', label: 'Listings', icon: Building2 },
    { to: '/rentals', label: 'Rentals', icon: Key },
    { to: '/projects', label: 'Projects', icon: Home },
    { to: '/saved', label: 'Saved', icon: Heart },
    { to: '/insights', label: 'Insights', icon: BarChart2 },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-tight">Ivy Homes</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition-colors"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user?.email && (
              <span className="text-sm text-gray-500">{user.email}</span>
            )}
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="block w-6 h-6" /> : <Menu className="block w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium flex items-center"
              >
                <Icon className="w-5 h-5 mr-3 text-gray-400" />
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left text-gray-600 hover:bg-gray-50 hover:text-red-600 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium flex items-center"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
