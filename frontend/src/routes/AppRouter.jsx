import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Impor Layout Utama
import MainLayout from '@/layouts/MainLayout';

// Impor Komponen Proteksi Akses
// (Ubah ke '@/ProtectedRoute' jika file berada langsung di folder src)
import ProtectedRoute from '@/components/ProtectedRoute';

// Impor Halaman yang Tersedia di Folder src/pages/
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Bookings from '@/pages/Bookings';
import Vehicles from '@/pages/Vehicles';
import Gallery from '@/pages/Gallery';
import Blog from '@/pages/Blog';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

// Diimpor sebagai RoutesPage agar tidak bentrok dengan <Routes> milik react-router-dom
import RoutesPage from '@/pages/Routes';

export default function AppRouter() {
  return (
    <Routes>
      {/* Rute Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />

      {/* Rute Utama (Mengarahkan otomatis ke dashboard admin) */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Rute Admin Terproteksi */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/routes"
        element={
          <ProtectedRoute>
            <RoutesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vehicles"
        element={
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/galleries"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback Rute Tidak Ditemukan (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
