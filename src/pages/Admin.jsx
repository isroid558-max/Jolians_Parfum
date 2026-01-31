import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useState } from "react";

export default function Admin() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    
    // State form produk
    const [formData, setFormData] = useState({
        name: '', harga: '', kategori: 'Parfum Badan', deskripsi: '', gambar: ''
    });

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setFormData(product);
        setActiveTab('form');
    };

    const handleDelete = (id) => {
        if(window.confirm('Yakin ingin menghapus produk ini?')) deleteProduct(id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData, harga: parseInt(formData.harga) };
        
        if (isEditing) {
            updateProduct(currentProduct.id, payload);
        } else {
            addProduct(payload);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', harga: '', kategori: 'Parfum Badan', deskripsi: '', gambar: '' });
        setIsEditing(false);
        setCurrentProduct(null);
        setActiveTab('products');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-pink-600">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'dashboard' ? 'bg-pink-50 text-pink-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`w-full text-left block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'products' || activeTab === 'form' ? 'bg-pink-50 text-pink-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}>
                        Manajemen Produk
                    </button>
                    <Link to="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-50 text-gray-600">
                        Pesanan
                    </Link>
                    <Link to="/logout" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-50 text-red-600">
                        Logout
                    </Link>
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8">
                
                {/* --- DASHBOARD TAB --- */}
                {activeTab === 'dashboard' && (
                <>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Penjualan</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">Rp 12.500.000</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Pesanan Baru</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">15</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Produk</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{products.length}</p>
                    </div>
                </div>
                </>
                )}

                {/* --- PRODUCTS TAB --- */}
                {activeTab === 'products' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Daftar Produk</h3>
                        <button onClick={() => { resetForm(); setActiveTab('form'); }} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                            + Tambah Produk
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.harga.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.kategori}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {/* --- FORM PRODUCT TAB --- */}
                {activeTab === 'form' && (
                    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                                <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.harga} onChange={e => setFormData({...formData, harga: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                                    <option value="Parfum Badan">Parfum Badan</option>
                                    <option value="Parfum Laundry">Parfum Laundry</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                                <input type="text" placeholder="https://..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.gambar} onChange={e => setFormData({...formData, gambar: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Simpan</button>
                                <button type="button" onClick={() => setActiveTab('products')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Batal</button>
                            </div>
                        </form>
                    </div>
                )}

            </main>
        </div>
    )
}