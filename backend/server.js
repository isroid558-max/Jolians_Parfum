const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware
app.use(cors()); // Agar frontend (port 5173) bisa akses backend (port 5000)
app.use(express.json());

// Route halaman utama agar tidak muncul error saat dibuka di browser
app.get('/', (req, res) => {
    res.send('Server Backend ISRO Berjalan dengan Aman!');
});

// --- MOCK DATABASE ---

// 1. Users (Password: Izz@tvn12)
// Kita hash password saat server nyala untuk simulasi
const hashPassword = (password) => bcrypt.hashSync(password, 10);

let users = [
    {
        id: 1,
        email: 'isroid558@gmail.com',
        password: hashPassword('Izz@tvn12'),
        role: 'admin',
        name: 'Isro Admin'
    },
    {
        id: 2,
        email: 'isrogamers@gmail.com',
        password: hashPassword('Izz@tvn12'),
        role: 'superadmin',
        name: 'Isro Super Admin'
    }
];

// 2. Products (Data dari src/data/products.js)
let products = [
    {
        id: 1,
        name: "Ethereal Bloom",
        gambar: "https://placehold.co/400x400/fce7f3/4a044e",
        alternatif: "Parfum Ethereal Bloom",
        deskripsi: "Aroma bunga musim semi yang lembut dan memikat, meninggalkan jejak keanggunan.",
        harga: 350000,
        kategori: "Parfum Badan"
    },
    {
        id: 2,
        name: "Oceanic Breeze",
        gambar: "https://placehold.co/400x400/e0f2fe/0c4a6e",
        alternatif: "Parfum Oceanic Breeze",
        deskripsi: "Kesegaran angin laut yang menyegarkan, cocok untuk jiwa petualang yang bebas.",
        harga: 325000,
        kategori: "Parfum Badan"
    },
    {
        id: 3,
        name: "Velvet Oud",
        gambar: "https://placehold.co/400x400/f3e8ff/3b0764",
        alternatif: "Parfum Velvet Oud",
        deskripsi: "Kehangatan aroma kayu oud yang mewah dan misterius, memberikan kesan sensual.",
        harga: 450000,
        kategori: "Parfum Badan"
    },
    {
        id: 4,
        name: "Citrus Glow",
        gambar: "https://placehold.co/400x400/fef9c3/854d0e",
        alternatif: "Parfum Citrus Glow",
        deskripsi: "Ledakan aroma jeruk yang ceria dan membangkitkan semangat sepanjang hari.",
        harga: 290000,
        kategori: "Parfum Badan"
    },
    {
        id: 5,
        name: "Spicy Ember",
        gambar: "https://placehold.co/400x400/fee2e2/991b1b",
        alternatif: "Parfum Spicy Ember",
        deskripsi: "Perpaduan rempah hangat yang membara, menciptakan aura percaya diri dan kuat.",
        harga: 380000,
        kategori: "Parfum Badan"
    },
    {
        id: 6,
        name: "Green Meadow",
        gambar: "https://placehold.co/400x400/dcfce7/166534",
        alternatif: "Parfum Green Meadow",
        deskripsi: "Aroma rerumputan hijau setelah hujan, menenangkan dan menyatu dengan alam.",
        harga: 310000,
        kategori: "Parfum Badan"
    },
    {
        id: 7,
        name: "Sakura Bloom",
        gambar: "https://placehold.co/300/pink/white?text=Sakura",
        alternatif: "Sakura",
        deskripsi: "Wangi bunga sakura yang segar untuk pakaian.",
        harga: 75000,
        kategori: "Parfum Laundry"
    },
    {
        id: 8,
        name: "Snappy Clean",
        gambar: "https://placehold.co/300/red/white?text=Snappy",
        alternatif: "Snappy",
        deskripsi: "Aroma kuat yang menghilangkan bau apek.",
        harga: 70000,
        kategori: "Parfum Laundry"
    },
    {
        id: 10,
        name: "Rose Elegance",
        gambar: "https://placehold.co/300/pink/white?text=Rose",
        alternatif: "Rose",
        deskripsi: "Aroma mawar yang elegan dan tahan lama.",
        harga: 150000,
        kategori: "Parfum Badan"
    },
    {
        id: 11,
        name: "Ocean Fresh",
        gambar: "https://placehold.co/300/skyblue/white?text=Ocean",
        alternatif: "Ocean",
        deskripsi: "Kesegaran laut yang menenangkan.",
        harga: 300000,
        kategori: "Parfum Badan"
    },
    {
        id: 12,
        name: "Sweet Vanilla",
        gambar: "https://placehold.co/300/orange/white?text=Vanilla",
        alternatif: "Vanilla",
        deskripsi: "Wangi manis vanilla yang lembut.",
        harga: 280000,
        kategori: "Parfum Badan"
    }
];

// 3. Orders (Mock Database)
let orders = [];

// --- ROUTES ---

// 1. Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(401).json({ message: "Email tidak ditemukan" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: "Login berhasil", token, user: { email: user.email, role: user.role } });
});

// 1b. Register Route
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        email,
        password: hashPassword(password),
        role: 'user', // Role default untuk pendaftar baru
        name // Simpan nama lengkap
    };

    users.push(newUser);
    res.status(201).json({ message: "Registrasi berhasil" });
});

// 2. Get Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 3. Add Product (Protected)
app.post('/api/products', (req, res) => {
    // TODO: Tambahkan middleware verifikasi token nanti
    const newProduct = { id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1, ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Orders Routes
// Get All Orders (Untuk Admin)
app.get('/api/orders', (req, res) => {
    // Mengirim data pesanan (terbaru di atas)
    res.json(orders.slice().reverse());
});

// Create Order (Dari Checkout)
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: `ORD-${Date.now()}`, // Generate ID unik berdasarkan waktu
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        ...req.body
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Update Order Status (Untuk Admin ubah status)
app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        res.json(order);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

// 5. Users Management Routes (Untuk Super Admin)
app.get('/api/users', (req, res) => {
    // Kirim data user (tanpa password) dan buat nama dari email
    const safeUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name || u.email.split('@')[0], // Gunakan nama asli jika ada, jika tidak gunakan email
        status: 'Active'
    }));
    res.json(safeUsers);
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.json({ message: "User berhasil dihapus" });
});

// Update User Role (Promote/Demote)
app.put('/api/users/:id/role', (req, res) => {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    const user = users.find(u => u.id === id);
    if (user) {
        user.role = role;
        res.json({ message: "Role berhasil diupdate", user });
    } else {
        res.status(404).json({ message: "User tidak ditemukan" });
    }
});

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});