import { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../data/constants';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    // State awal kosong, nanti diisi dari server
    const [products, setProducts] = useState([]);

    // Ambil data dari Backend saat aplikasi dimuat
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Gagal mengambil produk:", err));
    }, []);

    const addProduct = async (newProduct) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            const savedProduct = await response.json();
            setProducts(prev => [...prev, savedProduct]);
        } catch (err) {
            console.error("Gagal menambah produk:", err);
        }
    };

    const updateProduct = (id, updatedProduct) => {
        // Catatan: Fitur update di backend belum dibuat, ini hanya update tampilan sementara
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    };

    const deleteProduct = (id) => {
        // Catatan: Fitur delete di backend belum dibuat, ini hanya update tampilan sementara
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};