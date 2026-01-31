import CardProduct from "../components/CardProduct";
import { useProducts } from "../context/ProductContext";

export default function ParfumLaundry() {
    const { products } = useProducts();
    // Filter produk untuk kategori "Parfum Laundry"
    const parfumData = products.filter(p => p.kategori === "Parfum Laundry");

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Koleksi Parfum Laundry</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {parfumData.map((produk) => (
                    <CardProduct key={produk.id} {...produk} />
                ))}
            </div>
        </div>
    )
}