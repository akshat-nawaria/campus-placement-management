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
      <section className="w-full bg-surface-container-lowest flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Logo */}
          <div className="flex justify-center">
            <span className="text-display-lg font-bold text-primary">PlaceIT</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-headline-lg font-semibold text-on-surface text-center">
              {isRegistering ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-body-md text-on-surface-variant text-center">
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
    </main>
  );
}
