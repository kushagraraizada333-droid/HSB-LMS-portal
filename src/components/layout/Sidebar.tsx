import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HsbLogo } from '../common/HsbLogo';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  CalendarCheck2,
  GraduationCap,
  Megaphone,
  User,
  Users,
  FolderArchive,
  Award,
  Layers,
  Calendar,
  X,
  MapPin
} from 'lucide-react';
import { HSB_CAMPUS_INFO } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();
  const location = useLocation();

  // Role-specific navigation items
  const studentNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'Courses & Syllabus', href: '/student/courses', icon: BookOpen },
    { name: 'Assignments & PRDs', href: '/student/assignments', icon: FileCheck2, badge: '2 Pending' },
    { name: 'Attendance Record', href: '/student/attendance', icon: CalendarCheck2 },
    { name: 'Grades & Transcript', href: '/student/grades', icon: Award },
    { name: 'Campus Bulletins', href: '/student/announcements', icon: Megaphone },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  const facultyNavItems: NavItem[] = [
    { name: 'Faculty Dashboard', href: '/faculty', icon: LayoutDashboard },
    { name: 'Assigned Courses', href: '/faculty/courses', icon: BookOpen },
    { name: 'Evaluation & Grading', href: '/faculty/grading', icon: FileCheck2, badge: '14 Review' },
    { name: 'Attendance Register', href: '/faculty/attendance', icon: CalendarCheck2 },
    { name: 'Study Materials Library', href: '/faculty/materials', icon: FolderArchive },
    { name: 'Broadcast Notice', href: '/faculty/announcements', icon: Megaphone },
    { name: 'Faculty Profile', href: '/profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { name: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Student Roster', href: '/admin/students', icon: Users, badge: '480' },
    { name: 'Faculty Directory', href: '/admin/faculty', icon: GraduationCap, badge: '34' },
    { name: 'Curriculum & Courses', href: '/admin/courses', icon: Layers },
    { name: 'Study Materials Library', href: '/faculty/materials', icon: FolderArchive },
    { name: 'Announcements Center', href: '/admin/announcements', icon: Megaphone },
    { name: 'Registrar Profile', href: '/profile', icon: User },
  ];

  const currentNav =
    role === 'admin' ? adminNavItems : role === 'faculty' ? facultyNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1d3c74] text-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col justify-between border-r border-[#163b71] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header with Official HSB Logo */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-[#244a9a]/60 bg-[#0d1d3a]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <HsbLogo variant="white" height={28} />
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#1d3c74]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Cohort Summary Tag */}
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-[#244a9a]/50 border border-[#a3c5e9]/20 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                Active Term
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-black/20 px-1.5 py-0.2 rounded">
                {role?.toUpperCase()}
              </span>
            </div>
            <div className="text-xs font-bold text-white mt-1">
              MBA '27 • Trimester III
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-blue-100/80 mt-1">
              <MapPin className="w-3 h-3 text-[#ff9e4a]" />
              <span>Jaipur Campus</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#1955a6] text-white shadow-md shadow-[#0d1d3a]/40 font-semibold'
                      : 'text-slate-300 hover:bg-[#244a9a]/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-blue-300/70 group-hover:text-white'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#244a9a] text-amber-300 group-hover:bg-[#1955a6]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Profile Summary Card */}
        <div className="p-3 m-3 rounded-xl bg-[#0d1d3a] border border-[#244a9a]/40">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-300/40"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-blue-200/70 truncate font-mono">
                {user?.rollNumber || user?.designation || user?.email}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
