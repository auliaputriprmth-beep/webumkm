document.addEventListener('DOMContentLoaded', () => {

    // --- STATE APLIKASI ---
    let products = []; 
    let cart = [];

    // --- SELEKSI ELEMEN DOM ---
    const productGrid = document.getElementById('product-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const contactForm = document.getElementById('contact-form'); // Tambahkan selektor form kontak

    // --- FUNGSI-FUNGSI ---

    // 1. Fungsi untuk mengambil produk UNGGULAN dari server
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            productGrid.innerHTML = '<p>Gagal memuat produk. Pastikan server backend berjalan.</p>';
        }
    }

    // 2. Fungsi untuk merender produk ke halaman
    function renderProducts() {
        productGrid.innerHTML = '';
        products.forEach(product => {
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

    // 3. Fungsi untuk memperbarui tampilan keranjang
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

    // 4. Fungsi untuk menambah produk ke keranjang
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

    // 5. Fungsi untuk mengubah jumlah item di keranjang
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

    // --- EVENT LISTENER ---

    // Event Listener untuk tombol "Tambah ke Keranjang"
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Event Listener untuk tombol ubah jumlah di keranjang
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('increase-quantity') || event.target.classList.contains('decrease-quantity')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const change = event.target.classList.contains('increase-quantity') ? 1 : -1;
            changeQuantity(productId, change);
        }
    });

    // Event Listener untuk membuka dan menutup modal keranjang
    cartIcon.addEventListener('click', () => cartModal.style.display = 'block');
    closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) cartModal.style.display = 'none';
    });
    
    // Event Listener untuk tombol checkout
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
                    alert('Terima kasih! Pesanan Anda telah diterima dan akan segera kami proses.');
                    cart = []; // Kosongkan keranjang
                    updateCartUI();
                    cartModal.style.display = 'none';
                } else {
                    alert('Gagal memproses pesanan. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error saat checkout:', error);
                alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
            }
        } else {
            alert('Keranjang Anda masih kosong!');
        }
    });

    // Event Listener untuk form kontak
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Mencegah halaman refresh

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message); // Tampilkan pesan sukses
                    contactForm.reset(); // Kosongkan form
                } else {
                    alert('Gagal mengirim pesan. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error saat mengirim pesan:', error);
                alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
            }
        });
    }

    // --- ANIMASI SAAT SCROLL ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // --- INISIALISASI ---
    fetchProducts();
    updateCartUI();
});