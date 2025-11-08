document.addEventListener('DOMContentLoaded', () => {
    const ADMIN_PASSWORD = 'admin123'; // Ganti password admin di sini

    const password = prompt('Masukkan password admin:');
    if (password !== ADMIN_PASSWORD) {
        alert('Password salah! Akses ditolak.');
        window.location.href = 'index.html';
        return;
    }

    // --- Seleksi Elemen DOM ---
    const productForm = document.getElementById('product-form');
    const formTitle = document.getElementById('form-title');
    const productIdInput = document.getElementById('product-id');
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const imageInput = document.getElementById('image');
    const categoryInput = document.getElementById('category'); // TAMBAHKAN INI
    const isFeaturedInput = document.getElementById('is_featured'); // TAMBAHKAN INI
    const cancelEditBtn = document.getElementById('cancel-edit');
    const productTableBody = document.querySelector('#product-table tbody');

    // --- Fungsi-fungsi ---

    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) throw new Error('Gagal mengambil produk');
            const products = await response.json();
            productTableBody.innerHTML = '';
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>Rp ${parseInt(product.price).toLocaleString('id-ID')}</td>
                    <td>${product.category}</td>
                    <td><img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover;"></td>
                    <td>${product.is_featured ? 'Ya' : 'Tidak'}</td>
                    <td>
                        <button class="btn btn-warning edit-btn" data-id="${product.id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${product.id}">Hapus</button>
                    </td>
                `;
                productTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            alert('Gagal memuat data produk. Periksa console untuk detail.');
        }
    }

    function resetForm() {
        productForm.reset();
        productIdInput.value = '';
        formTitle.textContent = 'Tambah Produk Baru';
        cancelEditBtn.style.display = 'none';
    }

    async function populateFormForEdit(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`);
            if (!response.ok) throw new Error('Gagal mengambil data produk');
            const productToEdit = await response.json();
            
            productIdInput.value = productToEdit.id;
            nameInput.value = productToEdit.name;
            priceInput.value = productToEdit.price;
            imageInput.value = productToEdit.image;
            categoryInput.value = productToEdit.category; // ISI KATEGORI
            isFeaturedInput.checked = productToEdit.is_featured; // CENTANG UNGGULAN
            formTitle.textContent = `Edit Produk: ${productToEdit.name}`;
            cancelEditBtn.style.display = 'inline-block';
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Gagal mengambil data produk untuk edit:', error);
            alert('Gagal memuat data produk untuk diedit.');
        }
    }

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = productIdInput.value;
        const productData = {
            name: nameInput.value,
            price: priceInput.value,
            image: imageInput.value,
            category: categoryInput.value, // AMBIL DATA KATEGORI
            is_featured: isFeaturedInput.checked, // AMBIL DATA UNGGULAN
        };

        const url = id ? `http://localhost:3000/api/products/${id}` : 'http://localhost:3000/api/products';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal menyimpan produk');
            
            alert(`Produk berhasil ${id ? 'diupdate' : 'ditambahkan'}!`);
            resetForm();
            fetchAndDisplayProducts();
        } catch (error) {
            console.error('Gagal menyimpan produk:', error);
            alert(error.message);
        }
    });

    productTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const productId = event.target.getAttribute('data-id');
            await populateFormForEdit(productId);
        }
        if (event.target.classList.contains('delete-btn')) {
            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                const productId = event.target.getAttribute('data-id');
                try {
                    const response = await fetch(`http://localhost:3000/api/products/${productId}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message || 'Gagal menghapus produk');
                    
                    alert('Produk berhasil dihapus!');
                    fetchAndDisplayProducts();
                } catch (error) {
                    console.error('Gagal menghapus produk:', error);
                    alert(error.message);
                }
            }
        }
    });

    cancelEditBtn.addEventListener('click', resetForm);

    // Inisialisasi
    fetchAndDisplayProducts();
});