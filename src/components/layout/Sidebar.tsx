import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Bell, 
  Calendar,
  ClipboardList,
  FileText,
  UserCircle,
  LogOut,
  School
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: ('admin' | 'staff' | 'parent')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'parent'] },
  { label: 'Students', href: '/students', icon: GraduationCap, roles: ['admin', 'staff'] },
  { label: 'Attendance', href: '/attendance', icon: Calendar, roles: ['admin', 'staff'] },
  { label: 'Exam Results', href: '/results', icon: ClipboardList, roles: ['admin', 'staff'] },
  { label: 'My Children', href: '/my-children', icon: Users, roles: ['parent'] },
  { label: 'Staff', href: '/staff', icon: UserCircle, roles: ['admin'] },
  { label: 'Notifications', href: '/notifications', icon: Bell, roles: ['admin', 'staff', 'parent'] },
  { label: 'Leave Requests', href: '/leave', icon: FileText, roles: ['staff'] },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 gradient-primary shadow-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <School className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-display">Teckish</h1>
            <p className="text-xs text-white/70">School Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-primary shadow-lg'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-white/70 capitalize">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/90 hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};
