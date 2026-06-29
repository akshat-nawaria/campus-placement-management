import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import TpoDashboard from './pages/tpo/TpoDashboard';
import Students from './pages/tpo/Students';
import Companies from './pages/tpo/Companies';
import Jobs from './pages/tpo/Jobs';
import Applications from './pages/tpo/Applications';
import Offers from './pages/tpo/Offers';
import Analytics from './pages/tpo/Analytics';
import StudentDashboard from './pages/student/StudentDashboard';
import Profile from './pages/student/Profile';
import BrowseJobs from './pages/student/BrowseJobs';
import MyApplications from './pages/student/MyApplications';
import MyOffer from './pages/student/MyOffer';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

function RoleRedirect() {
  const { role } = useAuth();
  if (role === 'Admin' || role === 'TPO') return <Navigate to="/dashboard/tpo" replace />;
  if (role === 'Student') return <Navigate to="/dashboard/student" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: 'Inter', fontSize: '14px' },
                success: { duration: 3000 },
                error: { duration: 4000 },
              }}
            />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

              <Route
                path="/dashboard/tpo"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'TPO']}>
                    <DashboardLayout role="tpo" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TpoDashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="companies" element={<Companies />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="applications" element={<Applications />} />
                <Route path="offers" element={<Offers />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>

              <Route
                path="/dashboard/student"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Admin']}>
                    <DashboardLayout role="student" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="jobs" element={<BrowseJobs />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="offer" element={<MyOffer />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
