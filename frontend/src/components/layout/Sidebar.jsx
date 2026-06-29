import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const tpoLinks = [
  { to: '/dashboard/tpo', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/tpo/students', icon: 'school', label: 'Students' },
  { to: '/dashboard/tpo/companies', icon: 'corporate_fare', label: 'Companies' },
  { to: '/dashboard/tpo/jobs', icon: 'work', label: 'Jobs' },
  { to: '/dashboard/tpo/applications', icon: 'assignment', label: 'Applications' },
  { to: '/dashboard/tpo/offers', icon: 'assignment_turned_in', label: 'Offers' },
  { to: '/dashboard/tpo/analytics', icon: 'bar_chart', label: 'Analytics' },
];

const studentLinks = [
  { to: '/dashboard/student', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/student/profile', icon: 'person', label: 'Profile' },
  { to: '/dashboard/student/jobs', icon: 'work', label: 'Browse Jobs' },
  { to: '/dashboard/student/applications', icon: 'assignment', label: 'My Applications' },
  { to: '/dashboard/student/offer', icon: 'card_giftcard', label: 'My Offer' },
];

export default function Sidebar({ role, onClose }) {
  const { logout, role: userRole } = useAuth();
  const navigate = useNavigate();
  const links = role === 'tpo' ? tpoLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-[#1E293B] flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">PlaceIT Pro</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {role === 'tpo' ? 'Placement Office' : 'Student Portal'}
          </p>
        </div>
        <button onClick={onClose} className="lg:hidden text-[#94A3B8] hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-container text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {/* Post New Job button for TPO */}
        {role === 'tpo' && (
          <div className="pt-4">
            <NavLink
              to="/dashboard/tpo/jobs"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-container text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Post New Job
            </NavLink>
          </div>
        )}
      </nav>

      {/* Switch Portal & Logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {userRole === 'Admin' && (
          <button
            onClick={() => {
              navigate(role === 'tpo' ? '/dashboard/student' : '/dashboard/tpo');
              if (onClose) onClose();
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-primary/20 hover:bg-primary/40 transition-all w-full"
          >
            <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            Switch to {role === 'tpo' ? 'Student' : 'Admin'} Portal
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
