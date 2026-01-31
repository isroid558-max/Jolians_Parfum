import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulasi logika login sederhana
        console.log("Login dengan:", email, password);
        
        const cleanEmail = email.trim(); // Membersihkan spasi di awal/akhir email

        // Ganti email dan password admin di sini
        if (cleanEmail === "isroid558@gmail.com" && password === "Izz@tvn12") {
            login({ email: cleanEmail, role: 'admin' });
            navigate('/admin');
        // Ganti email dan password super admin di sini
        } else if (cleanEmail === "isrogamers@gmail.com" && password === "Izz@tvn12") {
            login({ email: cleanEmail, role: 'superadmin' });
            navigate('/super-admin');
        } else {
            // User biasa kembali ke home
            login({ email: cleanEmail, role: 'user' });
            navigate('/');
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
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            Masuk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}