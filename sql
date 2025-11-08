-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 08 Nov 2025 pada 03.41
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `umkm_database`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(500) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Makanan',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `category`, `is_featured`) VALUES
(1, 'Kerajinan Tangan Kayu Jati', 150000.00, 'https://kanalwisata.com/wp-content/uploads/2020/10/kerajinan-kayu.jpg', 'Kerajinan', 1),
(2, 'Madu Hutan Lokal 500ml', 85000.00, 'https://media.karousell.com/media/photos/products/2023/8/1/madu_hutan_baduy_asli_ngga_asl_1690899391_9150db38_progressive.jpg', 'Makanan', 1),
(3, 'Kain Tenun Etnik NTT', 250000.00, 'https://pariwisataindonesia.id/wp-content/uploads/2020/10/kain-tenun-NTT-mendunia-foto-by-mediaindonesiacom.jpg', 'Fashion', 1),
(4, 'Kopi Arabika Grade 1', 120000.00, 'https://azakopigayo.co.id/wp-content/uploads/2019/01/Honey4.jpg', 'Makanan', 0),
(5, 'Sabun Herbal Alami', 45000.00, 'https://mashmoshem.co.id/wp-content/uploads/2022/02/cara-membuat-sabun-herbal-1-scaled.jpg', 'Kesehatan', 0),
(6, 'Tas Anyaman Bambu', 95000.00, 'https://smexpo.pertamina.com/data-smexpo/images/products/4479/id-11134207-7rasj-m13vs48k9wia7b_1732849711.jpeg', 'Fashion', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
