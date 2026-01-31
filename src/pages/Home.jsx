import CardProduct from "../components/CardProduct";
import { useProducts } from "../context/ProductContext";

export default function Home() {
    const { products } = useProducts();
    
    // Ambil 4 produk pertama sebagai "Produk Terbaru"
    const produkTerbaru = products.slice(0, 4);

    return (
        <main className="bg-gray-50">
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Produk Terbaru</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {produkTerbaru.map((produk) => (
                        <CardProduct key={produk.id} {...produk} />
                    ))}
                </div>
            </div>
        </main>
    )
}