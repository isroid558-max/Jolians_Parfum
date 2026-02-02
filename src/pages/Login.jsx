import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // SECURITY FIX (A07): Persistent Lockout
    // Mengambil status lockout dari localStorage agar tidak hilang saat refresh
    const [failedAttempts, setFailedAttempts] = useState(() => parseInt(localStorage.getItem('failedAttempts') || '0'));
    const [isLocked, setIsLocked] = useState(() => {
        const lockoutUntil = localStorage.getItem('lockoutUntil');
        return lockoutUntil && new Date().getTime() < parseInt(lockoutUntil);
    });

    // Cek timer lockout saat komponen dimuat
    useEffect(() => {
        const lockoutUntil = localStorage.getItem('lockoutUntil');
        if (lockoutUntil) {
            const remainingTime = parseInt(lockoutUntil) - new Date().getTime();
            if (remainingTime > 0) {
                setTimeout(() => { 
                    setIsLocked(false); 
                    setFailedAttempts(0);
                    localStorage.removeItem('lockoutUntil');
                    localStorage.removeItem('failedAttempts');
                }, remainingTime);
            } else {
                setIsLocked(false);
                localStorage.removeItem('lockoutUntil');
            }
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isLocked) return; // Mencegah submit jika sedang terkunci

        const cleanEmail = email.trim(); // Membersihkan spasi di awal/akhir email

        // Panggil fungsi login dari AuthContext (yang request ke Backend)
        const result = await login(cleanEmail, password);

        if (result.success) {
            setFailedAttempts(0);
            localStorage.removeItem('failedAttempts');
            
            if (result.role === 'admin') navigate('/admin');
            else if (result.role === 'superadmin') navigate('/super-admin');
            else navigate('/');
        } else {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            localStorage.setItem('failedAttempts', newAttempts);

            if (newAttempts >= 3) {
                setIsLocked(true);
                localStorage.setItem('lockoutUntil', new Date().getTime() + 30000); // Kunci 30 detik
                alert("Terlalu banyak percobaan gagal. Akses dikunci selama 30 detik.");
                setTimeout(() => { 
                    setIsLocked(false); 
                    setFailedAttempts(0); 
                    localStorage.removeItem('lockoutUntil');
                    localStorage.removeItem('failedAttempts');
                }, 30000);
            } else {
                alert(`${result.message || "Login gagal"}! Sisa percobaan: ${3 - newAttempts}`);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Masuk ke Akun Anda
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLocked}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500`}
                        >
                            {isLocked ? "Terkunci Sementara..." : "Masuk"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}