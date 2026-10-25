const express = require('express');
const router = express.Router();

// Import Controller
const authController = require('../controllers/authController');
const authClientController = require('../controllers/authClientController');
const routeController = require('../controllers/routeController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const blogController = require('../controllers/blogController');
const galleryController = require('../controllers/galleryController');

// Import Middleware Upload & Kompresi Gambar
const { upload, compressImage } = require('../middleware/upload');

// Helper mencegah crash jika handler controller belum di-export
const getHandler = (controller, ...fnNames) => {
  for (const name of fnNames) {
    if (controller && typeof controller[name] === 'function') {
      return controller[name];
    }
  }
  return (req, res) => {
    res.status(501).json({
      success: false,
      message: `Handler belum diimplementasikan untuk route ${req.originalUrl}`
    });
  };
};

// Admin Auth & Profile Routes
router.post('/login', getHandler(authController, 'loginAdmin', 'login'));
router.post('/register', getHandler(authController, 'registerAdmin', 'register'));
router.post('/logout', getHandler(authController, 'logout', 'logoutAdmin'));
router.get('/profile', getHandler(authController, 'getProfile'));
router.put('/profile', getHandler(authController, 'updateProfile'));

// Client Auth & Profile Routes
router.post('/client/register', getHandler(authClientController, 'registerClient'));
router.post('/client/login', getHandler(authClientController, 'loginClient'));
router.post('/client/logout', getHandler(authClientController, 'logoutClient'));
router.get('/client/profile', getHandler(authClientController, 'getClientProfile', 'getProfile'));
router.put('/client/profile', getHandler(authClientController, 'updateClientProfile', 'updateProfile'));

// Route & Tarif Management Routes
router.get('/routes', getHandler(routeController, 'getAllRoutes', 'getRoutes'));
router.post('/routes', upload.single('image'), compressImage, getHandler(routeController, 'createRoute'));
router.put('/routes/:id', upload.single('image'), compressImage, getHandler(routeController, 'updateRoute'));
router.delete('/routes/:id', getHandler(routeController, 'deleteRoute'));

// Vehicle / Armada Routes
router.get('/vehicles', getHandler(vehicleController, 'getAllVehicles', 'getVehicles'));
router.post('/vehicles', upload.single('image'), compressImage, getHandler(vehicleController, 'createVehicle'));
router.put('/vehicles/:id', upload.single('image'), compressImage, getHandler(vehicleController, 'updateVehicle'));
router.delete('/vehicles/:id', getHandler(vehicleController, 'deleteVehicle'));

// Booking Routes
router.get('/bookings', getHandler(bookingController, 'getAllBookings', 'getBookings'));
router.post('/bookings', getHandler(bookingController, 'createBooking'));
router.put('/bookings/:id/status', getHandler(bookingController, 'updateBookingStatus'));
router.delete('/bookings/:id', getHandler(bookingController, 'deleteBooking'));

// Blog Routes
router.get('/blogs', getHandler(blogController, 'getAllBlogs', 'getBlogs'));
router.post('/blogs', upload.single('image'), compressImage, getHandler(blogController, 'createBlog'));
router.put('/blogs/:id', upload.single('image'), compressImage, getHandler(blogController, 'updateBlog'));
router.delete('/blogs/:id', getHandler(blogController, 'deleteBlog'));

// Gallery Routes
router.get('/galleries', getHandler(galleryController, 'getAllGalleries', 'getGalleries'));
router.post('/galleries', upload.single('image'), compressImage, getHandler(galleryController, 'createGallery'));
router.put('/galleries/:id', upload.single('image'), compressImage, getHandler(galleryController, 'updateGallery'));
router.delete('/galleries/:id', getHandler(galleryController, 'deleteGallery'));

module.exports = router;
