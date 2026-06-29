import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const routeTitles = {
  '/dashboard/tpo': 'Dashboard',
  '/dashboard/tpo/students': 'Students',
  '/dashboard/tpo/companies': 'Companies',
  '/dashboard/tpo/jobs': 'Jobs',
  '/dashboard/tpo/applications': 'Applications',
  '/dashboard/tpo/offers': 'Offers',
  '/dashboard/tpo/analytics': 'Analytics',
  '/dashboard/student': 'Dashboard',
  '/dashboard/student/profile': 'My Profile',
  '/dashboard/student/jobs': 'Browse Jobs',
  '/dashboard/student/applications': 'My Applications',
  '/dashboard/student/offer': 'My Offer',
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const title = routeTitles[location.pathname] || 'Dashboard';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-title-lg font-semibold text-on-surface">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User avatar */}
        <div className="w-9 h-9 bg-primary-container text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
