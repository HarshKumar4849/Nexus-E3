// FILE: backend/seedRoutes.js

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const Route = require('./models/RouteModel');
const ROUTES_JSON = require('./data/routes.json');

const seedRoutes = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB for seeding.");

        // Clean up existing routes to prevent duplication during seed
        await Route.deleteMany({});
        console.log("Cleared existing routes.");

        // Insert new routes
        for (const route of ROUTES_JSON) {
            // Remove any field that might conflict or let Mongoose handle it
            const newRoute = new Route({
                busNumber: route.busNumber,
                busName: route.busName,
                routeName: route.routeName || route.busName,
                startPoint: route.startPoint,
                stoppages: route.stoppages,
                endPoint: route.endPoint,
                classTime: route.classTime,
                arrivalBus: route.arrivalBus,
                isActive: true
            });
            await newRoute.save();
            console.log(`Inserted route: ${newRoute.routeName}`);
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedRoutes();
