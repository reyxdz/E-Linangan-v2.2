require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
    try {
        await connectDB();

        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin account already exists:');
            console.log(`  Username: ${existingAdmin.username}`);
            console.log('Skipping seed.');
            process.exit(0);
        }

        const admin = await User.create({
            username,
            password,
            firstName: 'System',
            lastName: 'Admin',
            role: 'admin',
            status: 'approved'
        });

        console.log('=== Admin Account Created ===');
        console.log(`  Username: ${admin.username}`);
        console.log(`  Password: ${password}`);
        console.log(`  Role: ${admin.role}`);
        console.log('=============================');
        console.log('IMPORTANT: Change the default password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedAdmin();
