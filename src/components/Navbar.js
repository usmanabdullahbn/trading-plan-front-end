"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Plus,
  Home,
  TrendingUp,
  Menu,
  X,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // ✅ reload page after logout

  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/trades", label: "Trades", icon: TrendingUp },
    { href: "/create-trade", label: "New Trade", icon: Plus },
  ];

  console.log(user?.user.photo)
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <BarChart3 className="h-8 w-8 text-indigo-600 transition-transform duration-300 group-hover:rotate-12 group-hover:text-indigo-800" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                Trading Plan
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Professional
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Login Button OR User Photo + Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative group">
                {/* Profile Photo */}
                <img
                  src={user?.user.photo}
                  alt={user?.user.name}
                  className="h-10 w-10 rounded-full border-2 border-indigo-500 shadow-md cursor-pointer"
                />

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 active:scale-95 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12 relative z-10" />
                <span className="relative z-10">Log In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-200">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 transform hover:translate-x-1"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
