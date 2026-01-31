import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Keranjang() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    // Menghitung total harga dari context
    const subtotal = cartTotal;
    const total = subtotal;

    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Keranjang Belanja</h1>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Daftar Item Keranjang */}
                    <div className="flex-1">
                        {cart.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b py-4 last:border-b-0 gap-4">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <img src={item.gambar} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                                <p className="text-gray-600">Rp {item.harga.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border rounded-md">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                                <span className="px-3 py-1 text-gray-800 font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2">Hapus</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <p className="text-gray-600 mb-4">Keranjang Anda kosong.</p>
                                <Link to="/" className="text-blue-600 hover:underline font-semibold">Mulai Belanja</Link>
                            </div>
                        )}
                    </div>

                    {/* Ringkasan Pesanan */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Ringkasan Pesanan</h2>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div className="flex justify-between mb-6 text-lg font-bold text-gray-800">
                                <span>Total</span>
                                <span>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                            <Link to="/checkout" className="block text-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg">
                                Checkout Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}