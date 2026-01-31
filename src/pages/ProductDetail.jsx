import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { WA_NUMBERS } from '../data/constants';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import CardProduct from '../components/CardProduct';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { products } = useProducts();
    const product = products.find(p => p.id === parseInt(id));

    // Scroll ke atas saat halaman detail dibuka/berubah
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h2>
                <Link to="/" className="text-blue-600 hover:underline">
                    Kembali ke Halaman Utama
                </Link>
            </div>
        );
    }

    const message = encodeURIComponent(`Halo, saya tertarik untuk membeli produk "${product.name}".`);
    const waLinkPalu = `https://wa.me/${WA_NUMBERS.PALU}?text=${message}`;
    const waLinkManado = `https://wa.me/${WA_NUMBERS.MANADO}?text=${message}`;

    // Filter produk serupa (kategori sama, tapi bukan produk ini)
    const relatedProducts = products
        .filter(p => p.kategori === product.kategori && p.id !== product.id)
        .slice(0, 4);

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row mb-12">
                    {/* Gambar Produk */}
                    <div className="md:w-1/2">
                        <img 
                            src={product.gambar} 
                            alt={product.alternatif} 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* Detail Produk */}
                    <div className="p-8 md:w-1/2 flex flex-col">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-2xl text-blue-600 font-semibold mb-4">
                            Rp {product.harga.toLocaleString('id-ID')}
                        </p>
                        <p className="text-gray-700 mb-6 flex-grow">{product.deskripsi}</p>
                        
                        <div className="mt-auto">
                            {/* Tombol Tambah ke Keranjang */}
                            <button 
                                onClick={() => addToCart(product)}
                                className="w-full mb-4 bg-pink-100 text-pink-600 font-bold py-3 px-6 rounded-lg hover:bg-pink-200 transition duration-300 flex items-center justify-center gap-2"
                            >
                                + Tambah ke Keranjang
                            </button>

                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pesan Sekarang via WhatsApp:</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href={waLinkPalu}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                                >
                                    Beli di Palu
                                </a>
                                <a 
                                    href={waLinkManado}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                                >
                                    Beli di Manado
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian Produk Serupa */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Produk Serupa</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((item) => (
                                <CardProduct key={item.id} {...item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}