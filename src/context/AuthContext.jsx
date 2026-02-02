import { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../data/constants';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Cek apakah ada data user di localStorage saat pertama kali load
    const savedUser = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    const EXPIRATION_TIME = 60 * 60 * 1000; // 1 Jam dalam milidetik

    if (savedUser && loginTime) {
      const now = new Date().getTime();
      if (now - parseInt(loginTime) > EXPIRATION_TIME) {
        // Sesi kadaluarsa
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        return null;
      }
      return JSON.parse(savedUser);
    }
    return null;
  });

  // Simpan status login ke localStorage setiap kali user berubah
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Kita set waktu login hanya saat login pertama kali (di fungsi login), bukan di useEffect ini agar waktu tidak ter-reset saat refresh
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('loginTime', new Date().getTime().toString());
        localStorage.setItem('token', data.token); // Simpan token untuk request selanjutnya
        return { success: true, role: data.user.role };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Gagal terhubung ke server" };
    }
  };

  const logout = () => setUser(null);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};