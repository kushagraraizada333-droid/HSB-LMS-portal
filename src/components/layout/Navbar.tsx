import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Badge } from '../common/Badge';
import { HsbLogo } from '../common/HsbLogo';
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DemoNoticeModal } from '../shared/DemoNoticeModal';
import { HSB_CAMPUS_INFO } from '../../data/mockData';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, switchRole, logout, isDemoMode } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        {/* Top Institutional Notification Bar */}
        {isDemoMode && (
          <div className="bg-[#1d3c74] text-slate-100 px-4 py-1 text-xs flex items-center justify-between border-b border-[#244a9a]">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300 bg-black/20 px-2 py-0.5 rounded text-[11px] border border-amber-300/30">
                <Sparkles className="w-3 h-3" /> Preview Environment
              </span>
              <span className="truncate text-slate-200 text-[11px]">
                Interactive academic LMS running with MBA Cohort 2025–27 curriculum data.
              </span>
            </div>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-amber-300 hover:text-white underline font-medium text-[11px] flex-shrink-0 ml-3 flex items-center gap-1"
            >
              <span>System & Data Notes</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Main Navbar */}
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile branding & Desktop Section Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile View: Clean HSB Logo (Sidebar hidden) */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <HsbLogo variant="blue" height={28} />
            </div>

            {/* Desktop View: Clean section header (Sidebar provides the main HSB brand mark) */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 font-serif">
                Academic Management Portal
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                MBA Trimester III
              </span>
            </div>
          </div>

          {/* Center: Quick Role Switcher */}
          <div className="hidden md:flex items-center bg-[#ecf2fa] p-1 rounded-xl border border-[#a3c5e9] text-xs">
            <span className="px-2 text-slate-500 font-medium text-[11px]">Active Persona:</span>
            <button
              onClick={() => switchRole('student')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                role === 'student'
                  ? 'bg-white text-[#1955a6] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => switchRole('faculty')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                role === 'faculty'
                  ? 'bg-white text-indigo-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                role === 'admin'
                  ? 'bg-white text-[#1d3c74] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registrar / Admin
            </button>
          </div>

          {/* Right: Notifications & Profile Menu */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={toggleDrawer}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-[#ecf2fa] focus:outline-none transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1955a6] text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#ecf2fa] focus:outline-none transition-colors border border-transparent hover:border-[#a3c5e9]"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#a3c5e9]"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="max-w-[120px] truncate">{user?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-[#1955a6] font-medium capitalize">{role}</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-[#f5f8fd]">
                    <div className="text-xs font-bold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge
                        size="sm"
                        variant={role === 'admin' ? 'gold' : role === 'faculty' ? 'secondary' : 'primary'}
                      >
                        {role?.toUpperCase()}
                      </Badge>
                      {user?.rollNumber && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {user.rollNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-[#ecf2fa] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#1955a6]" />
                      <span>Institutional Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsDemoModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-[#ecf2fa] flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      <span>System Architecture Notes</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <DemoNoticeModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </>
  );
};
