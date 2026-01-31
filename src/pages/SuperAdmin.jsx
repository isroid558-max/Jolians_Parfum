import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useState } from "react";

export default function SuperAdmin() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [activeTab, setActiveTab] = useState('overview');
    
    // --- STATE UNTUK MANAJEMEN ADMIN (Simulasi) ---
    const [admins, setAdmins] = useState([
        { id: 1, name: 'Admin Toko 1', email: 'admin1@jolians.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Admin Toko 2', email: 'admin2@jolians.com', role: 'Admin', status: 'Active' }
    ]);

    const handleDeleteAdmin = (id) => {
        if(window.confirm("Yakin ingin menghapus admin ini?")) {
            setAdmins(prev => prev.filter(a => a.id !== id));
        }
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
        const payload = { ...formData, harga: parseInt(formData.harga) };
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
                        <p className="text-3xl font-bold text-white mt-2">1,240</p>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-400 hover:text-red-300">Hapus / Turunkan</button>
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
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Manajemen Produk</h3>
                        <button onClick={() => { setFormData({ name: '', harga: '', kategori: 'Parfum Badan', deskripsi: '', gambar: '' }); setIsEditing(false); setActiveTab('form_product'); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                            + Tambah Produk
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Harga</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rp {product.harga.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.kategori}</td>
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