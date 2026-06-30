import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { googleLogin, emailLogin, registerUser } from '../api/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await googleLogin(response.credential);
      login(res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (isRegistering && !formData.name)) {
      return toast.error("Please fill in all fields");
    }
    
    setIsLoading(true);
    try {
      if (isRegistering) {
        const res = await registerUser(formData);
        login(res.data.token);
        toast.success(`Account created! Welcome, ${res.data.user.name}!`);
        navigate('/dashboard');
      } else {
        const res = await emailLogin({ email: formData.email, password: formData.password });
        login(res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || (isRegistering ? 'Registration failed' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-surface text-on-surface font-sans">
      {/* Left: Login Form Section */}
      <section className="w-full lg:w-1/2 bg-surface-container-lowest flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <span className="text-display-lg font-bold text-primary">PlaceIT</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-headline-lg font-semibold text-on-surface">
              {isRegistering ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {isRegistering ? 'Sign up to build your placement profile' : 'Sign in to your PlaceIT account'}
            </p>
          </div>

          {/* Google Sign-In */}
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google login failed')}
              width="100%"
              shape="rectangular"
              text={isRegistering ? "signup_with" : "continue_with"}
              size="large"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px bg-outline-variant flex-1" />
            <span className="text-label-md text-outline uppercase tracking-widest">or</span>
            <div className="h-px bg-outline-variant flex-1" />
          </div>

          {/* Email/Password Fields */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-6">
            {isRegistering && (
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2">Full Name</label>
                <div className="relative">
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John Doe"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Email Address</label>
              <div className="relative">
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="name@university.edu"
                  type="email"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
              </div>
            </div>
            
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Password</label>
              <div className="relative">
                <input
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="********"
                  type="password"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary font-semibold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-secondary text-label-md font-medium hover:underline transition-all"
            >
              {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
            <p className="text-body-sm text-outline text-center mt-2">
              For administrative access, please contact your department placement officer.
            </p>
          </div>
        </div>
      </section>

      {/* Right: Decorative Visual Section */}
      <section className="hidden lg:flex w-1/2 login-bg-gradient items-center justify-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />

        {/* Floating Analytics Card */}
        <div className="floating-card z-10 w-full max-w-lg p-1">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-title-lg font-semibold text-white">Live Placement Analytics</h3>
                <p className="text-body-sm text-white/60">Batch of 2024 • Institutional View</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-xl border border-primary/30">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <span className="text-label-md text-white/60 uppercase tracking-wider block mb-2">Placed Students</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-lg font-bold text-white">84.2%</span>
                  <span className="text-tertiary-fixed text-sm flex items-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 12%
                  </span>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <span className="text-label-md text-white/60 uppercase tracking-wider block mb-2">Avg. Package</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-lg font-bold text-white">$92k</span>
                  <span className="text-tertiary-fixed text-sm flex items-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 8%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-body-md text-white">Engineering Stream Completion</span>
                <span className="text-label-md text-white/80">142/160 Offers</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary-container w-[88%] rounded-full relative shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <span className="text-label-md text-white/40 uppercase tracking-wider block mb-4">Top Recruiters This Week</span>
              <div className="flex flex-wrap gap-4 opacity-70">
                {['TechNova', 'GlobalScale', 'NexGen'].map((r) => (
                  <div key={r} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <div className="w-5 h-5 bg-white/20 rounded-sm" />
                    <span className="text-xs text-white/80">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="absolute bottom-12 text-center px-12">
          <p className="text-title-md font-semibold text-white/90 italic mb-2">"The smarter way to manage academic career trajectories."</p>
          <span className="text-label-md text-white/50">— Trusted by 500+ Institutions</span>
        </div>
      </section>
    </main>
  );
}

