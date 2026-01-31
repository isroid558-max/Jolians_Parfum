import CardProduct from "../components/CardProduct";
import { useProducts } from "../context/ProductContext";

export default function ParfumBadan() {
    const { products } = useProducts();
    // Filter produk untuk kategori "Parfum Badan"
    const parfumBodyData = products.filter(p => p.kategori === "Parfum Badan");

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Koleksi Parfum Body</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {parfumBodyData.map((produk) => (
                    <CardProduct key={produk.id} {...produk} />
                ))}
            </div>
        </div>
    )
}