import { Link } from "react-router-dom";
// Import gambar dari folder assets (Pastikan file 'story.jpg' sudah ada di src/assets/)
import storyImage from "../assets/story.jpg";

export default function About() {
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-pink-500 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Jolians Parfum</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Menghadirkan keharuman mewah yang tak terlupakan untuk setiap momen berharga Anda.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img 
                            src={storyImage} 
                            alt="Tentang Kami" 
                            className="rounded-lg shadow-lg w-full"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Cerita Kami</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Jolians Parfum bermula dari kecintaan kami terhadap seni wewangian. Kami percaya bahwa parfum bukan sekadar aroma, melainkan identitas dan kenangan yang melekat.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Berbasis di Palu dan Manado, kami berkomitmen menyediakan parfum badan dan laundry dengan kualitas premium, tahan lama, dan harga yang terjangkau. Setiap tetes parfum kami diracik dengan bahan-bahan pilihan untuk memberikan kesegaran sepanjang hari.
                        </p>
                        <Link to="/" className="inline-block bg-pink-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-pink-600 transition duration-300">
                            Lihat Koleksi Kami
                        </Link>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Mengapa Memilih Kami?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
                                    <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Kualitas Premium</h3>
                            <p className="text-gray-600">Bahan baku berkualitas tinggi untuk aroma yang mewah dan elegan.</p>
                        </div>
                        <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Tahan Lama</h3>
                            <p className="text-gray-600">Diformulasikan khusus agar wangi bertahan sepanjang hari aktivitas Anda.</p>
                        </div>
                        <div className="text-center p-6 rounded-xl hover:shadow-lg transition duration-300">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Harga Terjangkau</h3>
                            <p className="text-gray-600">Kemewahan parfum kelas atas dengan harga yang bersahabat.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="container mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Hubungi Kami</h2>
                <div className="flex flex-col md:flex-row justify-center gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
                        <h3 className="text-xl font-bold mb-2 text-pink-500">Cabang Palu</h3>
                        <p className="text-gray-600">Jl. Contoh No. 123, Palu</p>
                        <p className="text-gray-600 mt-2">WA: 0852-4688-5534</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
                        <h3 className="text-xl font-bold mb-2 text-pink-500">Cabang Manado</h3>
                        <p className="text-gray-600">Jl. Sampel No. 456, Manado</p>
                        <p className="text-gray-600 mt-2">WA: 0813-4767-1991</p>
                    </div>
                </div>
            </div>
        </main>
    )
}