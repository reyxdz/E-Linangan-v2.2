const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const School = require('../models/School');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Kailangan ang username at password.' });
        }

        const user = await User.findOne({ username }).populate('schoolId', 'schoolId name');
        if (!user) {
            return res.status(401).json({ message: 'Mali ang username o password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mali ang username o password.' });
        }

        // Check if student or teacher is approved
        if (['student', 'teacher'].includes(user.role) && user.status !== 'approved') {
            if (user.status === 'pending') {
                const contact = user.role === 'student'
                    ? 'Makipag-ugnayan sa iyong guro.'
                    : 'Makipag-ugnayan sa system admin.';
                return res.status(403).json({ message: `Hinihintay pa ang pag-apruba ng iyong account. ${contact}` });
            }
            if (user.status === 'rejected') {
                const contact = user.role === 'student'
                    ? 'Makipag-ugnayan sa iyong guro.'
                    : 'Makipag-ugnayan sa system admin.';
                return res.status(403).json({ message: `Tinanggihan ang iyong rehistrasyon. ${contact}` });
            }
        }

        const token = generateToken(user);
        const safeUser = user.toSafeObject();

        res.json({
            message: 'Matagumpay na naka-login.',
            token,
            user: safeUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// POST /api/auth/register (student or teacher self-registration)
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, schoolId, role } = req.body;

        // Validate role — only student and teacher can self-register
        const allowedRoles = ['student', 'teacher'];
        const userRole = allowedRoles.includes(role) ? role : 'student';

        // Common required fields
        if (!username || !password || !firstName || !lastName || !schoolId) {
            return res.status(400).json({ message: 'Kailangan ang lahat ng field.' });
        }



        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
        }

        // Verify school exists
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(400).json({ message: 'Hindi natagpuan ang paaralan.' });
        }

        const newUser = await User.create({
            username,
            password,
            firstName,
            lastName,
            role: userRole,
            schoolId,
            status: 'pending'
        });

        const approver = userRole === 'student'
            ? 'Hinihintay ang pag-apruba ng guro.'
            : 'Hinihintay ang pag-apruba ng system admin.';

        res.status(201).json({
            message: `Matagumpay na nairehistro. ${approver}`,
            user: newUser.toSafeObject()
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
        }
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/auth/profile (update own username/password)
router.patch('/profile', verifyToken, async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Hindi natagpuan ang user.' });
        }

        // Only students and teachers can edit their profile
        if (!['student', 'teacher'].includes(user.role)) {
            return res.status(403).json({ message: 'Bawal i-edit ang profile ng admin dito.' });
        }

        // If updating username
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
            }
            user.username = username;
        }

        // If updating password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Kailangan ang kasalukuyang password para magpalit.' });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mali ang kasalukuyang password.' });
            }
            user.password = newPassword;
        }

        await user.save();

        // Generate new token with potentially updated info
        const token = generateToken(user);

        res.json({
            message: 'Matagumpay na na-update ang profile.',
            token,
            user: user.toSafeObject()
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// GET /api/auth/me (get current user)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('schoolId', 'schoolId name');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// GET /api/auth/schools (public - for registration dropdown)
router.get('/schools', async (req, res) => {
    try {
        const schools = await School.find({}).select('_id schoolId name').sort('name');
        res.json({ schools });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

module.exports = router;
