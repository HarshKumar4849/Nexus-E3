const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/UserModel');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected for seeding');

        let adminUser = await User.findOne({ email: 'admin@test.edu' });
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('Password123!', 10);
            adminUser = new User({
                fullname: 'System Admin',
                email: 'admin@test.edu',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin user created successfully!');
        } else {
            console.log('Admin user already exists.');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Seeding error:', err);
        mongoose.connection.close();
    }
};

seedAdmin();
