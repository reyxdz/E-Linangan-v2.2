const express = require('express');
const User = require('../models/User');
const Score = require('../models/Score');
const LessonProgress = require('../models/LessonProgress');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All teacher routes require teacher role
router.use(verifyToken, requireRole('teacher'));

// ========== PENDING STUDENT REQUESTS ==========

// GET /api/teacher/pending
router.get('/pending', async (req, res) => {
    try {
        const pendingStudents = await User.find({
            role: 'student',
            status: 'pending',
            schoolId: req.user.schoolId
        })
            .select('-password')
            .populate('schoolId', 'schoolId name')
            .sort('-createdAt');

        res.json({ students: pendingStudents });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/teacher/approve/:id
router.patch('/approve/:id', async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: 'student',
            status: 'pending',
            schoolId: req.user.schoolId
        });

        if (!student) {
            return res.status(404).json({ message: 'Hindi natagpuan ang estudyante o hindi kayo pareho ng paaralan.' });
        }

        student.status = 'approved';
        student.approvedBy = req.user._id;
        await student.save();

        res.json({
            message: `Matagumpay na na-aprubahan si ${student.firstName} ${student.lastName}.`,
            student: student.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// PATCH /api/teacher/reject/:id
router.patch('/reject/:id', async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: 'student',
            status: 'pending',
            schoolId: req.user.schoolId
        });

        if (!student) {
            return res.status(404).json({ message: 'Hindi natagpuan ang estudyante o hindi kayo pareho ng paaralan.' });
        }

        student.status = 'rejected';
        await student.save();

        res.json({
            message: `Tinanggihan ang rehistrasyon ni ${student.firstName} ${student.lastName}.`,
            student: student.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// ========== STUDENT LIST ==========

// GET /api/teacher/students
router.get('/students', async (req, res) => {
    try {
        const { gradeLevel } = req.query;
        const filter = {
            role: 'student',
            status: 'approved',
            schoolId: req.user.schoolId
        };
        if (gradeLevel) filter.gradeLevel = gradeLevel;

        const students = await User.find(filter)
            .select('-password')
            .sort('lastName firstName');

        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// ========== STUDENT PERFORMANCE ==========

// GET /api/teacher/performance
router.get('/performance', async (req, res) => {
    try {
        const { gradeLevel, quizStatus, scoreMin, scoreMax } = req.query;
        const filter = {
            role: 'student',
            status: 'approved',
            schoolId: req.user.schoolId
        };
        if (gradeLevel) filter.gradeLevel = gradeLevel;

        // Get students
        const students = await User.find(filter)
            .select('-password')
            .sort('lastName firstName');

        // Get all scores and progress for these students
        const studentIds = students.map(s => s._id);

        const [scores, progress] = await Promise.all([
            Score.find({ studentId: { $in: studentIds } }),
            LessonProgress.find({ studentId: { $in: studentIds } })
        ]);

        // Build performance data
        const performanceData = students.map(student => {
            const studentScores = scores.filter(
                s => s.studentId.toString() === student._id.toString()
            );
            const studentProgress = progress.filter(
                p => p.studentId.toString() === student._id.toString()
            );

            const paunangScore = studentScores.find(s => s.quizType === 'paunang');
            const pangwakasScore = studentScores.find(s => s.quizType === 'pangwakas');

            const paunangPct = paunangScore ? paunangScore.percentage : null;
            const pangwakasPct = pangwakasScore ? pangwakasScore.percentage : null;
            const improvement = (paunangPct !== null && pangwakasPct !== null)
                ? pangwakasPct - paunangPct
                : null;

            const completedLessons = studentProgress.filter(p => p.completed).length;
            const totalTimeSpent = studentProgress.reduce((sum, p) => sum + (p.timeSpentSeconds || 0), 0);

            return {
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                gradeLevel: student.gradeLevel,
                paunangScore: paunangScore ? {
                    score: paunangScore.score,
                    total: paunangScore.totalQuestions,
                    percentage: paunangPct
                } : null,
                pangwakasScore: pangwakasScore ? {
                    score: pangwakasScore.score,
                    total: pangwakasScore.totalQuestions,
                    percentage: pangwakasPct
                } : null,
                improvement,
                lessonsCompleted: `${completedLessons}/3`,
                totalTimeSpentSeconds: totalTimeSpent,
                lessonDetails: studentProgress.map(p => ({
                    lessonId: p.lessonId,
                    completed: p.completed,
                    timeSpentSeconds: p.timeSpentSeconds
                }))
            };
        });

        // Apply quiz status filter
        let filteredData = performanceData;
        if (quizStatus === 'completed_both') {
            filteredData = filteredData.filter(d => d.paunangScore && d.pangwakasScore);
        } else if (quizStatus === 'completed_pretest') {
            filteredData = filteredData.filter(d => d.paunangScore && !d.pangwakasScore);
        } else if (quizStatus === 'not_started') {
            filteredData = filteredData.filter(d => !d.paunangScore && !d.pangwakasScore);
        }

        // Apply score range filter
        if (scoreMin !== undefined) {
            filteredData = filteredData.filter(d =>
                (d.pangwakasScore && d.pangwakasScore.percentage >= Number(scoreMin)) ||
                (d.paunangScore && d.paunangScore.percentage >= Number(scoreMin))
            );
        }
        if (scoreMax !== undefined) {
            filteredData = filteredData.filter(d =>
                (d.pangwakasScore && d.pangwakasScore.percentage <= Number(scoreMax)) ||
                (d.paunangScore && d.paunangScore.percentage <= Number(scoreMax))
            );
        }

        res.json({
            totalStudents: filteredData.length,
            performance: filteredData
        });
    } catch (error) {
        console.error('Performance error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

module.exports = router;
