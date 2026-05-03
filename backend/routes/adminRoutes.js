const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const isLoggedIn = require('../middleware/isLoggedin');

// Basic middleware to check admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access denied: Admins only." });
    }
};

// Admin Settings
router.get('/settings', isLoggedIn, adminController.getSettings);
router.put('/settings', isLoggedIn, isAdmin, adminController.updateSettings);

// Driver Management
router.get('/drivers', isLoggedIn, isAdmin, adminController.getDrivers);
router.put('/drivers/assign', isLoggedIn, isAdmin, adminController.updateDriverAssignment);

module.exports = router;
