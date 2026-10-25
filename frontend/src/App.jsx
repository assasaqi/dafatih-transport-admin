import React from 'react';
import { useLocation } from 'react-router-dom';

// Impor Komponen Navigasi & Layout Publik
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

// Impor Router Utama Aplikasi
import AppRouter from '@/routes/AppRouter';

export default function App() {
    const location = useLocation();

    // Cek apakah halaman yang dibuka adalah halaman admin (/admin/...)
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div
            className="app-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%',
                overflowX: 'hidden'
            }}
        >
            {/* 1. Header & Navigasi Atas Publik (Disembunyikan di Halaman Admin) */}
            {!isAdminRoute && <Navbar />}

            {/* 2. Rute Konten Utama Halaman */}
            <main className="main-content" style={{ flex: '1 0 auto', width: '100%' }}>
                <AppRouter />
            </main>

            {/* 3. Footer Bagian Bawah Publik */}
            {!isAdminRoute && <Footer />}

            {/* 4. Navigasi Melayang Bawah Khusus HP (Publik) */}
            {!isAdminRoute && <MobileBottomNav />}
        </div>
    );
}
