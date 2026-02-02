import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import CardProduct from "../components/CardProduct";
import { useEffect, useState } from "react";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const { products } = useProducts();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [keyword, setKeyword] = useState(query);

    // Sinkronisasi input dengan URL saat halaman dimuat
    useEffect(() => {
        setKeyword(query);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            setSearchParams({ q: keyword.trim() });
        } else {
            setSearchParams({});
        }
    };

    useEffect(() => {
        if (products && query) {
            const lowerQuery = query.toLowerCase();
            
            // 1. Deteksi Pencarian Kategori (Laundry atau Body/Badan)
            // Cek apakah user mengetik kata kunci kategori (termasuk typo umum)
            const isLaundrySearch = ['laundry', 'loundry', 'loundri', 'landry'].some(k => lowerQuery.includes(k));
            const isBodySearch = ['body', 'badan', 'parfum badan'].some(k => lowerQuery.includes(k));

            if (isLaundrySearch) {
                setFilteredProducts(products.filter(p => (p.kategori || "").toLowerCase().includes('laundry')));
            } else if (isBodySearch) {
                setFilteredProducts(products.filter(p => (p.kategori || "").toLowerCase().includes('badan')));
            } else {
                // 2. Logika Pencarian Nama
                const results = products.filter(product => {
                    const name = (product.name || "").toLowerCase();
                    // Jika query hanya 1 huruf, filter berdasarkan AWALAN huruf (Starts With)
                    if (lowerQuery.length === 1) {
                        return name.startsWith(lowerQuery);
                    }
                    // Jika lebih dari 1 huruf, filter berdasarkan KANDUNGAN kata (Includes)
                    return name.includes(lowerQuery);
                });
                setFilteredProducts(results);
            }
        } else {
            setFilteredProducts([]);
        }
    }, [query, products]);

    return (
        <div className="p-4 min-h-screen bg-gray-50">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Pencarian Produk
                </h2>

                {/* Search Bar dengan Icon (Mobile Friendly) */}
                <div className="max-w-xl mx-auto mb-8 px-2">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Cari nama parfum, wangi, atau kategori..."
                            className="w-full py-3 pl-5 pr-12 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition shadow-md"
                            aria-label="Cari"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {query ? (
                    <>
                        <p className="text-center text-gray-600 mb-8">
                            Menampilkan hasil untuk: <span className="font-bold text-pink-600">"{query}"</span>
                        </p>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <CardProduct key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xl text-gray-500 font-semibold">Produk tidak ditemukan.</p>
                                <p className="text-gray-400 mt-2">Coba kata kunci lain atau periksa ejaan Anda.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Silakan masukkan kata kunci pencarian.</p>
                    </div>
                )}
            </div>
        </div>
    );
}