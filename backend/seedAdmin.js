require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/UserModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Delete and recreate all test users fresh
    const emails = ['admin@test.edu', 'student@test.edu', 'driver@test.edu'];
    await User.deleteMany({ email: { $in: emails } });
    console.log('Deleted old test users');

    const users = [
      { fullname: 'System Admin',  email: 'admin@test.edu',   password: 'Admin@1234',   role: 'admin' },
      { fullname: 'Test Student',  email: 'student@test.edu', password: 'Student@1234', role: 'student', regdNo: 'ITER2021001' },
      { fullname: 'Test Driver',   email: 'driver@test.edu',  password: 'Driver@1234',  role: 'driver', routeNo: 'CUTTACK-1-A', timing: '06:00 AM' },
    ];

    for (const u of users) {
      const { password, ...rest } = u;
      const hash = await bcrypt.hash(password, 10);
      const created = await User.create({ ...rest, password: hash, isBlocked: false });
      const verify = await bcrypt.compare(password, created.password);
      console.log('CREATED:', u.email, '| bcrypt verify:', verify, '| role:', created.role);
    }

    console.log('\nAll test users recreated successfully!');
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  mongoose.connection.close();
})();
