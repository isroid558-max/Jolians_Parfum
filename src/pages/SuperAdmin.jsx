import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../data/constants";

export default function SuperAdmin() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // SECURITY FIX (A01): Broken Access Control
    // Mencegah akses langsung ke halaman Super Admin
    useEffect(() => {
        if (!user || user.role !== 'superadmin') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'superadmin') return null;

    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [activeTab, setActiveTab] = useState('overview');
    
    // --- STATE UNTUK MANAJEMEN ADMIN (REAL DATA) ---
    const [admins, setAdmins] = useState([]);
    const [orders, setOrders] = useState([]);

    // Fetch users dari backend saat tab users atau overview dibuka
    useEffect(() => {
        if (activeTab === 'users' || activeTab === 'overview') {
            fetch(`${API_BASE_URL}/api/users`)
                .then(res => res.json())
                .then(data => setAdmins(data))
                .catch(err => console.error("Gagal load users:", err));
        }
        if (activeTab === 'orders') {
            fetch(`${API_BASE_URL}/api/orders`)
                .then(res => res.json())
                .then(data => setOrders(data))
                .catch(err => console.error("Gagal ambil pesanan:", err));
        }
    }, [activeTab]);

    const handleDeleteAdmin = async (id) => {
        if(window.confirm("Yakin ingin menghapus user ini?")) {
            await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
            setAdmins(prev => prev.filter(a => a.id !== id));
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if(window.confirm(`Ubah role user ini menjadi ${newRole}?`)) {
            try {
                await fetch(`${API_BASE_URL}/api/users/${id}/role`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: newRole })
                });
                setAdmins(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
            } catch (error) {
                console.error("Gagal update role:", error);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // Update UI Optimistic
        setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
        // Update Server
        await fetch(`${API_BASE_URL}/api/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    };

    // --- STATE UNTUK PRODUK (Sama seperti Admin) ---
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', harga: '', kategori: 'Parfum Badan', deskripsi: '', gambar: ''
    });

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setFormData(product);
        setActiveTab('form_product');
    };

    const handleDeleteProduct = (id) => {
        if(window.confirm('Yakin ingin menghapus produk ini?')) deleteProduct(id);
    };

    const handleSubmitProduct = (e) => {
        e.preventDefault();

        // SECURITY FIX (A03): Data Integrity Validation (Konsistensi dengan Admin.jsx)
        // 1. Validasi Harga tidak boleh negatif
        const hargaInt = parseInt(formData.harga);
        if (isNaN(hargaInt) || hargaInt < 0) {
            alert("Harga harus berupa angka valid dan tidak boleh negatif!");
            return;
        }

        // 2. Validasi Format URL Gambar
        try {
            new URL(formData.gambar);
        } catch (_) {
            alert("Format URL gambar tidak valid! Harus diawali http:// atau https://");
            return;
        }

        // SECURITY FIX (A03): Sanitasi input teks
        const sanitize = (text) => typeof text === 'string' ? text.replace(/[<>]/g, '') : text;

        const payload = { 
            ...formData, 
            name: sanitize(formData.name),
            deskripsi: sanitize(formData.deskripsi),
            harga: hargaInt
        };

        if (isEditing) updateProduct(currentProduct.id, payload);
        else addProduct(payload);
        
        setFormData({ name: '', harga: '', kategori: 'Parfum Badan', deskripsi: '', gambar: '' });
        setIsEditing(false);
        setActiveTab('products');
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 shadow-md hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-400">Super Admin</h1>
                </div>
                <nav className="mt-6">
                    <button onClick={() => setActiveTab('overview')} className={`w-full text-left block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'overview' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                        Overview
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`w-full text-left block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'users' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                        Manajemen User
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full text-left block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'orders' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                        Pesanan
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`w-full text-left block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'products' || activeTab === 'form_product' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                        Pengaturan Sistem
                    </button>
                    <Link to="/logout" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-900 text-red-400 mt-8">
                        Logout
                    </Link>
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">System Overview</h2>
                    <div className="text-gray-400">Welcome, Super Admin</div>
                </div>

                {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-white mt-2">{admins.length}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Active Admins</h3>
                        <p className="text-3xl font-bold text-white mt-2">{admins.length}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Server Status</h3>
                        <p className="text-3xl font-bold text-green-400 mt-2">{products.length}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Errors (24h)</h3>
                        <p className="text-3xl font-bold text-red-400 mt-2">0</p>
                    </div>
                </div>
                )}

                {activeTab === 'users' && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4">Daftar Pengguna Admin</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {admins.map(admin => (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{admin.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{admin.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{admin.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">{admin.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Sembunyikan aksi jika role adalah superadmin */}
                                            {admin.role !== 'superadmin' && (
                                                <div className="flex items-center gap-3">
                                                    {/* Icon Naikkan ke Admin (Hanya muncul jika role user) */}
                                                    {admin.role === 'user' && (
                                                        <button onClick={() => handleRoleChange(admin.id, 'admin')} className="text-green-400 hover:text-green-300" title="Jadikan Admin">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {/* Icon Turunkan ke User (Hanya muncul jika role admin) */}
                                                    {admin.role === 'admin' && (
                                                        <button onClick={() => handleRoleChange(admin.id, 'user')} className="text-yellow-400 hover:text-yellow-300" title="Turunkan ke User">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {/* Icon Hapus */}
                                                    <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-400 hover:text-red-300" title="Hapus User">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {activeTab === 'orders' && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4 text-white">Daftar Pesanan Masuk</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pelanggan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="font-medium text-white">{order.customer}</div>
                                            <div className="text-xs text-gray-500">{order.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{order.items}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rp {order.total.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.status === 'Selesai' ? 'bg-green-900 text-green-200' : 
                                                  order.status === 'Proses' ? 'bg-blue-900 text-blue-200' : 
                                                  order.status === 'Batal' ? 'bg-red-900 text-red-200' :
                                                  'bg-yellow-900 text-yellow-200'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="text-sm bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Proses">Proses</option>
                                                <option value="Selesai">Selesai</option>
                                                <option value="Batal">Batal</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {/* --- PRODUCT MANAGEMENT (SUPER ADMIN) --- */}
                {activeTab === 'products' && (
                <div className="space-y-8">
                    {/* Parfum Badan Section */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-pink-400">Manajemen Parfum Badan</h3>
                            <button onClick={() => { setFormData({ name: '', harga: '', kategori: 'Parfum Badan', deskripsi: '', gambar: '' }); setIsEditing(false); setActiveTab('form_product'); }} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                                + Tambah Parfum Badan
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Harga</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {products.filter(p => p.kategori === 'Parfum Badan').map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rp {product.harga.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleEditProduct(product)} className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-300">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Parfum Laundry Section */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-blue-400">Manajemen Parfum Laundry</h3>
                            <button onClick={() => { setFormData({ name: '', harga: '', kategori: 'Parfum Laundry', deskripsi: '', gambar: '' }); setIsEditing(false); setActiveTab('form_product'); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                + Tambah Parfum Laundry
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Harga</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {products.filter(p => p.kategori === 'Parfum Laundry').map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rp {product.harga.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleEditProduct(product)} className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-300">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                )}

                {activeTab === 'form_product' && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-white">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                        <form onSubmit={handleSubmitProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Nama Produk</label>
                                <input type="text" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Harga (Rp)</label>
                                <input type="number" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white" value={formData.harga} onChange={e => setFormData({...formData, harga: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Kategori</label>
                                <select className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                                    <option value="Parfum Badan">Parfum Badan</option>
                                    <option value="Parfum Laundry">Parfum Laundry</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">URL Gambar</label>
                                <input type="text" placeholder="https://..." className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white" value={formData.gambar} onChange={e => setFormData({...formData, gambar: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Deskripsi</label>
                                <textarea rows="3" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                                <button type="button" onClick={() => setActiveTab('products')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Batal</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}