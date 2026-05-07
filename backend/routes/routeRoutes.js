// FILE: backend/routes/routeRoutes.js

const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const isLoggedIn = require('../middleware/isLoggedin');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access denied: Admins only." });
    }
};

// Public GETs
router.get('/', routeController.getAllRoutes);
router.get('/:busId', routeController.getRouteByBus);

// Admin-only POST, PUT, DELETE
router.post('/', isLoggedIn, isAdmin, routeController.createRoute);
router.put('/:id', isLoggedIn, isAdmin, routeController.updateRoute);
router.delete('/:id', isLoggedIn, isAdmin, routeController.deleteRoute);

module.exports = router;
