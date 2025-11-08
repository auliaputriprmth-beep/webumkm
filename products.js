document.addEventListener('DOMContentLoaded', () => {
    // --- STATE APLIKASI ---
    let products = [];
    let cart = [];
    let currentFilter = 'Semua';

    // ================== TAMBAHKAN KODE INI ==================
    // Baca kategori dari URL jika ada
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl) {
        currentFilter = categoryFromUrl;
    }
    // =======================================================

    // --- SELEKSI ELEMEN DOM ---
    // ... (kode di bawahnya tidak berubah)
    

    // --- SELEKSI ELEMEN DOM ---
    const productGrid = document.getElementById('product-grid');
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- FUNGSI-FUNGSI KERANJANG ---
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        let totalItems = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                totalPrice += item.price * item.quantity;
                totalItems += item.quantity;
            });
        }
        cartTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        cartCount.textContent = totalItems;
    }

    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...productToAdd, quantity: 1 });
            }
            updateCartUI();
        }
    }

    function changeQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            updateCartUI();
        }
    }

    // --- FUNGSI-FUNGSI PRODUK ---
    async function fetchProducts() {
        try {
            // Mengambil SEMUA produk dari endpoint yang benar
            const response = await fetch('http://localhost:3000/api/all-products');
            products = await response.json();
            renderFilterButtons();
            renderProducts();
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            productGrid.innerHTML = '<p>Gagal memuat produk. Pastikan server backend berjalan.</p>';
        }
    }

    function renderFilterButtons() {
        const categories = ['Semua', ...new Set(products.map(p => p.category))];
        filterButtonsContainer.innerHTML = categories.map(cat => 
            `<button class="filter-btn ${cat === currentFilter ? 'active' : ''}" data-category="${cat}">${cat}</button>`
        ).join('');
    }

    function renderProducts() {
        const filteredProducts = currentFilter === 'Semua' 
            ? products 
            : products.filter(p => p.category === currentFilter);

        productGrid.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Tambah ke Keranjang</button>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    // --- EVENT LISTENER ---
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('increase-quantity') || event.target.classList.contains('decrease-quantity')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const change = event.target.classList.contains('increase-quantity') ? 1 : -1;
            changeQuantity(productId, change);
        }
    });

    filterButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            currentFilter = event.target.getAttribute('data-category');
            renderFilterButtons();
            renderProducts();
        }
    });

    cartIcon.addEventListener('click', () => cartModal.style.display = 'block');
    closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) cartModal.style.display = 'none';
    });
    
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length > 0) {
            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const orderData = { items: cart, total: totalPrice };
            try {
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });
                if (response.ok) {
                    alert('Terima kasih! Pesanan Anda telah diterima.');
                    cart = []; updateCartUI(); cartModal.style.display = 'none';
                } else { alert('Gagal memproses pesanan.'); }
            } catch (error) { console.error('Error saat checkout:', error); alert('Terjadi kesalahan jaringan.'); }
        } else { alert('Keranjang Anda masih kosong!'); }
    });

    // --- INISIALISASI ---
    fetchProducts();
    updateCartUI();
});