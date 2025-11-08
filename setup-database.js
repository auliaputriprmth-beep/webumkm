// setup-database.js
const mysql = require('mysql2/promise');

async function setupDatabase() {
    // Ganti 'password' dengan password MySQL Anda
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // <-- GANTI INI!
        database: 'umkm_database'
    });

    const products = [
        { name: 'Kerajinan Tangan Kayu Jati', price: 150000, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1887' },
        { name: 'Madu Hutan Lokal 500ml', price: 85000, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1887' },
        { name: 'Kain Tenun Etnik NTT', price: 250000, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1964' },
        { name: 'Kopi Arabika Grade 1', price: 120000, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1887' },
        { name: 'Sabun Herbal Alami', price: 45000, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1964' },
        { name: 'Tas Anyaman Bambu', price: 95000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1886' },
    ];

    for (const product of products) {
        await connection.execute('INSERT INTO products (name, price, image) VALUES (?, ?, ?)', [product.name, product.price, product.image]);
    }

    console.log('Data produk berhasil dimasukkan!');
    await connection.end();
}

setupDatabase();