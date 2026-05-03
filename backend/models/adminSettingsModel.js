const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    adminName: { type: String, default: 'Super Admin' },
    adminPhone: { type: String, default: '' },
    dutyInstructions: { type: String, default: 'Please follow your assigned route carefully and ensure student safety.' }
}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
