import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../data/constants';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    // SECURITY FIX (A04): Honeypot State untuk menjebak bot
    const [botTrap, setBotTrap] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // SECURITY FIX (A04): Cek Honeypot
        // Jika botTrap terisi, berarti yang mengisi adalah bot (karena field ini hidden bagi manusia)
        if (botTrap) {
            console.warn("Bot detected!");
            return; // Diam-diam tolak tanpa alert
        }

        // SECURITY FIX (A07): Password Policy
        // Password minimal 8 karakter, harus ada huruf besar, huruf kecil, dan angka
        // PERBAIKAN: Mengganti [a-zA-Z\d] menjadi . (titik) agar simbol diperbolehkan
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Password lemah! Gunakan minimal 8 karakter, kombinasi huruf besar, kecil, dan angka.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Password tidak cocok!");
            return;
        }
        
        // Kirim data ke Backend
        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registrasi berhasil! Silakan login.");
                navigate('/login');
            } else {
                alert(data.message || "Registrasi gagal.");
            }
        } catch (error) {
            console.error("Error register:", error);
            alert("Gagal terhubung ke server.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Buat Akun Baru
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">Nama Lengkap</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Nama Lengkap"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Konfirmasi Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                                placeholder="Konfirmasi Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        {/* SECURITY FIX (A04): Honeypot Field (Hidden) */}
                        <div className="hidden opacity-0 absolute -left-[9999px]">
                            <label htmlFor="website-trap">Website</label>
                            <input
                                id="website-trap"
                                name="website"
                                type="text"
                                tabIndex="-1"
                                autoComplete="off"
                                value={botTrap}
                                onChange={(e) => setBotTrap(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            Daftar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}