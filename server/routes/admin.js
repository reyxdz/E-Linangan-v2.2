const express = require('express');
const User = require('../models/User');
const School = require('../models/School');
const Score = require('../models/Score');
const LessonProgress = require('../models/LessonProgress');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(verifyToken, requireRole('admin'));

// ========== DASHBOARD STATS ==========

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [totalSchools, totalTeachers, totalStudents, pendingStudents, pendingTeachers, totalAdmins] = await Promise.all([
            School.countDocuments(),
            User.countDocuments({ role: 'teacher', status: 'approved' }),
            User.countDocuments({ role: 'student', status: 'approved' }),
            User.countDocuments({ role: 'student', status: 'pending' }),
            User.countDocuments({ role: 'teacher', status: 'pending' }),
            User.countDocuments({ role: 'admin' })
        ]);

        res.json({
            totalSchools,
            totalTeachers,
            totalStudents,
            pendingStudents,
            pendingTeachers,
            totalAdmins
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// ========== SCHOOLS CRUD ==========

// GET /api/admin/schools
router.get('/schools', async (req, res) => {
    try {
        const schools = await School.find({})
            .populate('createdBy', 'firstName lastName')
            .sort('-createdAt');
        res.json({ schools });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// POST /api/admin/schools
router.post('/schools', async (req, res) => {
    try {
        const { schoolId, name } = req.body;
        if (!schoolId || !name) {
            return res.status(400).json({ message: 'Kailangan ang School ID at pangalan.' });
        }

        const existing = await School.findOne({ schoolId });
        if (existing) {
            return res.status(400).json({ message: 'Ginagamit na ang School ID na ito.' });
        }

        const school = await School.create({
            schoolId,
            name,
            createdBy: req.user._id
        });

        res.status(201).json({ message: 'Matagumpay na naidagdag ang paaralan.', school });
    } catch (error) {
        console.error('Create school error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/admin/schools/:id
router.patch('/schools/:id', async (req, res) => {
    try {
        const { schoolId, name } = req.body;
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'Hindi natagpuan ang paaralan.' });
        }

        if (schoolId && schoolId !== school.schoolId) {
            const existing = await School.findOne({ schoolId });
            if (existing) {
                return res.status(400).json({ message: 'Ginagamit na ang School ID na ito.' });
            }
            school.schoolId = schoolId;
        }
        if (name) school.name = name;

        await school.save();
        res.json({ message: 'Matagumpay na na-update ang paaralan.', school });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// DELETE /api/admin/schools/:id
router.delete('/schools/:id', async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'Hindi natagpuan ang paaralan.' });
        }

        // Check if there are users assigned to this school
        const usersInSchool = await User.countDocuments({ schoolId: school._id });
        if (usersInSchool > 0) {
            return res.status(400).json({
                message: `Hindi mabubura. May ${usersInSchool} user(s) na naka-assign sa paaralang ito.`
            });
        }

        await School.findByIdAndDelete(req.params.id);
        res.json({ message: 'Matagumpay na nabura ang paaralan.' });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// ========== TEACHERS CRUD ==========

// GET /api/admin/teachers
router.get('/teachers', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = { role: 'teacher' };
        if (status) filter.status = status;

        const teachers = await User.find(filter)
            .select('-password')
            .populate('schoolId', 'schoolId name')
            .sort('-createdAt');
        res.json({ teachers });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// GET /api/admin/teachers/pending
router.get('/teachers/pending', async (req, res) => {
    try {
        const pendingTeachers = await User.find({ role: 'teacher', status: 'pending' })
            .select('-password')
            .populate('schoolId', 'schoolId name')
            .sort('-createdAt');
        res.json({ teachers: pendingTeachers });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/admin/teachers/:id/approve
router.patch('/teachers/:id/approve', async (req, res) => {
    try {
        const teacher = await User.findOne({ _id: req.params.id, role: 'teacher', status: 'pending' });
        if (!teacher) {
            return res.status(404).json({ message: 'Hindi natagpuan ang guro o na-approve na.' });
        }
        teacher.status = 'approved';
        teacher.approvedBy = req.user._id;
        await teacher.save();
        res.json({ message: `Matagumpay na na-aprubahan si ${teacher.firstName} ${teacher.lastName}.`, teacher: teacher.toSafeObject() });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/admin/teachers/:id/reject
router.patch('/teachers/:id/reject', async (req, res) => {
    try {
        const teacher = await User.findOne({ _id: req.params.id, role: 'teacher', status: 'pending' });
        if (!teacher) {
            return res.status(404).json({ message: 'Hindi natagpuan ang guro o na-reject na.' });
        }
        teacher.status = 'rejected';
        await teacher.save();
        res.json({ message: `Tinanggihan ang rehistrasyon ni ${teacher.firstName} ${teacher.lastName}.`, teacher: teacher.toSafeObject() });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// POST /api/admin/teachers
router.post('/teachers', async (req, res) => {
    try {
        const { username, password, firstName, lastName, schoolId } = req.body;
        if (!username || !password || !firstName || !lastName || !schoolId) {
            return res.status(400).json({ message: 'Kailangan ang lahat ng field.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
        }

        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(400).json({ message: 'Hindi natagpuan ang paaralan.' });
        }

        const teacher = await User.create({
            username,
            password,
            firstName,
            lastName,
            role: 'teacher',
            schoolId,
            status: 'approved',
            createdBy: req.user._id
        });

        res.status(201).json({
            message: 'Matagumpay na naidagdag ang guro.',
            teacher: teacher.toSafeObject()
        });
    } catch (error) {
        console.error('Create teacher error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/admin/teachers/:id
router.patch('/teachers/:id', async (req, res) => {
    try {
        const { username, password, firstName, lastName, schoolId } = req.body;
        const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
        if (!teacher) {
            return res.status(404).json({ message: 'Hindi natagpuan ang guro.' });
        }

        if (username && username !== teacher.username) {
            const existing = await User.findOne({ username });
            if (existing) {
                return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
            }
            teacher.username = username;
        }
        if (password) teacher.password = password;
        if (firstName) teacher.firstName = firstName;
        if (lastName) teacher.lastName = lastName;
        if (schoolId) {
            const school = await School.findById(schoolId);
            if (!school) {
                return res.status(400).json({ message: 'Hindi natagpuan ang paaralan.' });
            }
            teacher.schoolId = schoolId;
        }

        await teacher.save();
        res.json({ message: 'Matagumpay na na-update ang guro.', teacher: teacher.toSafeObject() });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// DELETE /api/admin/teachers/:id
router.delete('/teachers/:id', async (req, res) => {
    try {
        const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
        if (!teacher) {
            return res.status(404).json({ message: 'Hindi natagpuan ang guro.' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Matagumpay na nabura ang guro.' });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// ========== ADMINS CRUD ==========

// GET /api/admin/admins
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort('-createdAt');
        res.json({ admins });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// POST /api/admin/admins
router.post('/admins', async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Kailangan ang lahat ng field.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
        }

        const admin = await User.create({
            username,
            password,
            firstName,
            lastName,
            role: 'admin',
            status: 'approved',
            createdBy: req.user._id
        });

        res.status(201).json({
            message: 'Matagumpay na naidagdag ang admin.',
            admin: admin.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/admin/admins/:id
router.patch('/admins/:id', async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Hindi natagpuan ang admin.' });
        }

        if (username && username !== admin.username) {
            const existing = await User.findOne({ username });
            if (existing) {
                return res.status(400).json({ message: 'Ginagamit na ang username na ito.' });
            }
            admin.username = username;
        }
        if (password) admin.password = password;
        if (firstName) admin.firstName = firstName;
        if (lastName) admin.lastName = lastName;

        await admin.save();
        res.json({ message: 'Matagumpay na na-update ang admin.', admin: admin.toSafeObject() });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// DELETE /api/admin/admins/:id
router.delete('/admins/:id', async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Hindi mo mabubura ang sarili mong account.' });
        }

        const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Hindi natagpuan ang admin.' });
        }

        // Ensure at least one admin remains
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            return res.status(400).json({ message: 'Hindi mabubura. Kailangan ng kahit isang admin.' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Matagumpay na nabura ang admin.' });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// ========== STUDENTS (View/Delete) ==========

// GET /api/admin/students
router.get('/students', async (req, res) => {
    try {
        const { status, schoolId } = req.query;
        const filter = { role: 'student' };
        if (status) filter.status = status;
        if (schoolId) filter.schoolId = schoolId;

        const students = await User.find(filter)
            .select('-password')
            .populate('schoolId', 'schoolId name')
            .populate('approvedBy', 'firstName lastName')
            .sort('-createdAt');
        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// DELETE /api/admin/students/:id
router.delete('/students/:id', async (req, res) => {
    try {
        const student = await User.findOne({ _id: req.params.id, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Hindi natagpuan ang estudyante.' });
        }

        // Also delete their scores and progress
        await Promise.all([
            Score.deleteMany({ studentId: req.params.id }),
            LessonProgress.deleteMany({ studentId: req.params.id }),
            User.findByIdAndDelete(req.params.id)
        ]);

        res.json({ message: 'Matagumpay na nabura ang estudyante at lahat ng kanyang datos.' });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

module.exports = router;
