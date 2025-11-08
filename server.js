// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path'); // TAMBAHKAN INI

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// GANTI BARIS INI
app.use(express.static(path.join(__dirname, 'public'))); 

// Koneksi ke Database MySQL
let db;
async function initDB() {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'umkm_database'
    });
    console.log('Terhubung ke MySQL!');
}

// --- API UNTUK USER ---
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products WHERE is_featured = TRUE');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/all-products', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products ORDER BY category ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/orders', async (req, res) => {
    const { items, total } = req.body;
    console.log('Pesanan diterima:', { items, total });
    res.status(201).json({ message: 'Pesanan berhasil dibuat!' });
});

// --- API CRUD UNTUK ADMIN ---
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data produk.' });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, price, image, category, is_featured } = req.body;
    if (!name || !price || !image || !category) {
        return res.status(400).json({ message: 'Field name, price, image, dan category harus diisi.' });
    }
    try {
        const [result] = await db.execute('INSERT INTO products (name, price, image, category, is_featured) VALUES (?, ?, ?, ?, ?)', [name, price, image, category, is_featured || false]);
        res.status(201).json({ id: result.insertId, name, price, image, category, is_featured });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambah produk.' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, image, category, is_featured } = req.body;
    try {
        const [result] = await db.execute('UPDATE products SET name = ?, price = ?, image = ?, category = ?, is_featured = ? WHERE id = ?', [name, price, image, category, is_featured || false, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json({ id, name, price, image, category, is_featured });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengupdate produk.' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus produk.' });
    }
});

// ... kode API CRUD untuk admin ...

// --- API UNTUK FORM KONTAK ---
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Di sini Anda bisa menambahkan logika untuk mengirim email
    // atau menyimpan pesan ke database.
    // Untuk saat ini, kita cukup tampilkan di console server.
    console.log('Pesan baru diterima:');
    console.log('Nama:', name);
    console.log('Email:', email);
    console.log('Pesan:', message);
    console.log('--------------------------------');

    res.status(201).json({ message: 'Pesan Anda berhasil terkirim! Terima kasih.' });
});


// Jalankan Server
// ... kode app.listen yang sudah ada
// Jalankan Server
app.listen(PORT, async () => {
    await initDB();
    console.log(`Server berjalan di http://localhost:${PORT}`);
});