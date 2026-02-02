import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { WA_NUMBERS, API_BASE_URL } from '../data/constants';

export default function Checkout() {
    const { cart, cartTotal } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        location: 'PALU', // Default location
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Helper untuk membersihkan input dari karakter berbahaya (HTML tags)
    const sanitize = (text) => {
        return text.replace(/[<>]/g, '');
    };

    const handleCheckout = async () => {
        // SECURITY FIX (A03): Input Validation
        // Pastikan nomor HP hanya berisi angka dan panjangnya wajar
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Nomor WhatsApp tidak valid! Harap masukkan 10-15 digit angka.");
            return;
        }

        if (formData.name.trim().length < 3) {
            alert("Nama terlalu pendek.");
            return;
        }

        // 1. Format rincian produk
        const productDetails = cart.map(item => 
            `- ${item.name} (x${item.quantity}) - Rp ${(Number(item.harga) || 0).toLocaleString('id-ID')}`
        ).join('\n');

        // 2. Hitung total
        const subtotal = cartTotal;
        const total = subtotal;

        // 3. Buat pesan lengkap untuk WhatsApp
        const message = `
Halo, saya ingin memesan:

*DETAIL PESANAN:*
${productDetails}

-----------------------------------
*Subtotal:* Rp ${subtotal.toLocaleString('id-ID')}
*TOTAL:* *Rp ${total.toLocaleString('id-ID')}*
-----------------------------------

*DATA PENGIRIMAN:*
*Nama:* ${sanitize(formData.name)}
*No. WhatsApp:* ${formData.phone}
*Alamat:* ${sanitize(formData.address)}

Pesanan untuk cabang *${formData.location}*.

Mohon konfirmasi ketersediaan dan total biayanya. Terima kasih!
        `;

        // 4. Tentukan nomor WA tujuan
        const targetNumber = formData.location === 'PALU' ? WA_NUMBERS.PALU : WA_NUMBERS.MANADO;
        const waLink = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

        // 5. Simpan Pesanan ke Backend (Database)
        try {
            await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData.name,
                    total: total,
                    items: cart.map(item => `${item.name} (${item.quantity})`).join(', '),
                    phone: formData.phone,
                    address: formData.address,
                    location: formData.location
                })
            });
        } catch (error) {
            console.error("Gagal menyimpan pesanan ke database:", error);
            // Tetap lanjut ke WA meskipun gagal simpan ke DB agar user tidak kecewa
        }

        // 6. Arahkan ke WhatsApp
        window.location.href = waLink;
    };

    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Pengiriman */}
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Alamat Pengiriman</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                <textarea name="address" id="address" rows="3" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Proses dari Cabang</label>
                                <select name="location" id="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="PALU">Palu</option>
                                    <option value="MANADO">Manado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Pesanan */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                    <span className="font-medium">Rp {(item.harga * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                            <hr className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <button onClick={handleCheckout} className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-lg">
                                Kirim Pesanan via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}