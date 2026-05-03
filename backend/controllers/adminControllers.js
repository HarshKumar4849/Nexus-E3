const AdminSettings = require('../models/adminSettingsModel');
const User = require('../models/UserModel');

exports.getSettings = async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = await AdminSettings.create({});
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        console.error("Error fetching admin settings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { adminName, adminPhone, dutyInstructions } = req.body;
        
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings();
        }
        
        if (adminName !== undefined) settings.adminName = adminName;
        if (adminPhone !== undefined) settings.adminPhone = adminPhone;
        if (dutyInstructions !== undefined) settings.dutyInstructions = dutyInstructions;
        
        await settings.save();
        res.status(200).json({ success: true, settings, message: "Settings updated successfully" });
    } catch (error) {
        console.error("Error updating admin settings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('-password');
        res.status(200).json({ success: true, drivers });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateDriverAssignment = async (req, res) => {
    try {
        const { driverId, routeNo, busNumber } = req.body;
        
        const driver = await User.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        
        if (routeNo !== undefined) driver.routeNo = routeNo;
        // Optionally store busNumber if you add it to the schema, but user schema has routeNo
        
        await driver.save();
        res.status(200).json({ success: true, driver, message: "Driver updated successfully" });
    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
