const express = require('express');
const LessonProgress = require('../models/LessonProgress');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/progress/start — Record lesson start
router.post('/start', verifyToken, requireRole('student'), async (req, res) => {
    try {
        const { lessonId } = req.body;

        if (!lessonId || !['aralin1', 'aralin2', 'aralin3'].includes(lessonId)) {
            return res.status(400).json({ message: 'Invalid lesson ID.' });
        }

        // Upsert — create if not exists, update startedAt if exists
        const progress = await LessonProgress.findOneAndUpdate(
            { studentId: req.user._id, lessonId },
            {
                $setOnInsert: {
                    studentId: req.user._id,
                    lessonId,
                    completed: false,
                    timeSpentSeconds: 0
                },
                $set: { startedAt: new Date() }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ message: 'Lesson start recorded.', progress });
    } catch (error) {
        console.error('Progress start error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// POST /api/progress/complete — Record lesson completion + time
router.post('/complete', verifyToken, requireRole('student'), async (req, res) => {
    try {
        const { lessonId, timeSpentSeconds } = req.body;

        if (!lessonId || !['aralin1', 'aralin2', 'aralin3'].includes(lessonId)) {
            return res.status(400).json({ message: 'Invalid lesson ID.' });
        }

        const progress = await LessonProgress.findOneAndUpdate(
            { studentId: req.user._id, lessonId },
            {
                $set: {
                    completed: true,
                    completedAt: new Date()
                },
                $inc: { timeSpentSeconds: timeSpentSeconds || 0 }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ message: 'Lesson completion recorded.', progress });
    } catch (error) {
        console.error('Progress complete error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// GET /api/progress/me — Get current student's lesson progress
router.get('/me', verifyToken, requireRole('student'), async (req, res) => {
    try {
        const progress = await LessonProgress.find({ studentId: req.user._id });
        res.json({ progress });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

module.exports = router;
