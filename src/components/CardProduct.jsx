import { Link } from "react-router-dom";
import { useState } from "react";
import { WA_NUMBERS } from "../data/constants";
import { useCart } from "../context/CartContext";

export default function CardProduct({ id, name, gambar, harga, deskripsi }) {
    const { addToCart } = useCart();
    const [showOptions, setShowOptions] = useState(false);

    // Format pesan WhatsApp
    const message = encodeURIComponent(`Halo, saya tertarik untuk membeli produk "${name}".`);
    const waLinkPalu = `https://wa.me/${WA_NUMBERS.PALU}?text=${message}`;
    const waLinkManado = `https://wa.me/${WA_NUMBERS.MANADO}?text=${message}`;
    
    // Helper untuk format harga
    const formattedPrice = typeof harga === 'number' 
        ? `Rp ${harga.toLocaleString('id-ID')}` 
        : harga;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
            <div className="relative h-48 overflow-hidden">
                {/* Logika: Gambar dibungkus Link agar intuitif */}
                <Link to={id ? `/produk/${id}` : '#'}>
                    <img 
                        src={gambar} 
                        alt={name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                </Link>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
                <p className="text-blue-600 font-bold text-md mb-2">{formattedPrice}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{deskripsi}</p>
                
                <div className="flex gap-2 mb-3 mt-auto">
                    {/* Tombol Detail */}
                    <Link to={id ? `/produk/${id}` : '#'} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium" title="Lihat Detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Detail
                    </Link>
                    
                    {/* Tombol Keranjang */}
                    <button 
                        onClick={() => addToCart({ id, name, gambar, harga })}
                        className="flex-1 bg-pink-50 text-pink-600 py-2 rounded-md hover:bg-pink-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium" 
                        title="Tambah ke Keranjang"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Keranjang
                    </button>
                </div>

                {/* Tombol Beli (WhatsApp) */}
                <div className="pt-3 border-t border-gray-100">
                    {!showOptions ? (
                        <button 
                            onClick={() => setShowOptions(true)}
                            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Beli Sekarang
                        </button>
                    ) : (
                        <div className="flex gap-2 animate-fade-in">
                            <a 
                                href={waLinkPalu} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                            >
                                Palu
                            </a>
                            <a 
                                href={waLinkManado} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                            >
                                Manado
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}