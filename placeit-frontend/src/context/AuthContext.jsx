import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('placeit_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('placeit_token');
        } else {
          setUser(decoded);
          setRole(decoded.role);
        }
      } catch {
        localStorage.removeItem('placeit_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('placeit_token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setRole(decoded.role);
  };

  const logout = () => {
    localStorage.removeItem('placeit_token');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
