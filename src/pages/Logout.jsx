import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        logout();
        // Arahkan kembali ke halaman utama setelah "logout"
        setTimeout(() => navigate('/'), 1500);
    }, [navigate, logout]);

    return (
        <div className="container p-6 mx-auto text-center">
            <h1 className="text-2xl font-bold">Anda sedang keluar...</h1>
        </div>
    );
}