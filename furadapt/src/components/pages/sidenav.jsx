import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { chatAPI } from "../../utils/api";
// Icons from Lucide React
import { Home, PawPrint, ClipboardList, MessageCircle, User, Info, LogOut, Menu, Settings } from "lucide-react";
import logo from "../../assets/logo1.png"; // <-- Add this import

const NavItem = ({ icon, label, isActive, onClick, onHover, isHovered, badge }) => {
  return (
    <li className="relative my-1 px-4">
      <button
        className={`flex w-full items-center rounded-lg py-3 px-4 text-left transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
            : "hover:bg-blue-50 text-slate-700"
        }`}
        onClick={onClick}
        onMouseEnter={() => onHover(label)}
        onMouseLeave={() => onHover(null)}
      >
        <span className={`mr-3 transition-all duration-300 ${isActive ? "text-white" : "text-blue-500"}`}>
          {icon}
        </span>
        <span className={`font-medium transition-all duration-300 ${isActive ? "font-semibold" : ""}`}>
          {label}
        </span>
        {badge && badge > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      {isHovered && !isActive && (
        <div className="absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 animate-fadeIn whitespace-nowrap rounded-md border border-blue-100 bg-white psx-4 py-2 font-medium text-blue-600 shadow-lg">
          {label}
        </div>
      )}
    </li>
  );
};

const Sidenav = ({ currentPage, onNavigate, onHide }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hovered, setHovered] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await chatAPI.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };
  
  const navConfig = [
    { label: "Dashboard", icon: <Home size={20} /> },
    { label: "Pet Listing", icon: <PawPrint size={20} /> },
    { label: "My Pets", icon: <Settings size={20} /> },
    { label: "Adoption Request", icon: <ClipboardList size={20} /> },
    { label: "Chat", icon: <MessageCircle size={20} />, badge: unreadCount },
    { label: "Profile", icon: <User size={20} /> },
    { label: "About Us", icon: <Info size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="flex h-screen w-64 flex-col border-r border-blue-100 bg-white shadow-md transition-all duration-300">
      {/* Header with Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">  
        <div className="flex items-center">
          {/* Replace the blue F with the logo */}
          <img
            src={logo}
            alt="FurAdapt Logo"
            className="mr-3 h-10 w-10 rounded-full border-2 border-blue-400 bg-white shadow-sm object-cover"
          />
          <h1 className="text-xl font-bold text-blue-600">FurAdopt</h1>
        </div>
        
        <button
          onClick={onHide}
          className="rounded-md p-2 text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          aria-label="Hide sidebar"
        >
          <Menu size={22} />
        </button>
      </div>
      
      {/* Navigation Items */}
      <ul className="mt-3 flex-1 space-y-1 px-2">
        {navConfig.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.label}
            onClick={item.onClick || (() => onNavigate(item.label))}
            onHover={setHovered}
            isHovered={hovered === item.label}
            badge={item.badge}
          />
        ))}
      </ul>
      
      {/* User Info */}
      {user && (
        <div className="border-t border-blue-100 p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Logout Button */}
      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 py-3 px-4 font-semibold text-white shadow-md hover:from-amber-500 hover:to-amber-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidenav;