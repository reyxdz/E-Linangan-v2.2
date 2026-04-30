const express = require('express');
const Score = require('../models/Score');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/scores — Submit quiz score (first attempt only)
router.post('/', verifyToken, requireRole('student'), async (req, res) => {
    try {
        const { quizType, score, totalQuestions } = req.body;

        if (!quizType || score === undefined || !totalQuestions) {
            return res.status(400).json({ message: 'Kailangan ang quizType, score, at totalQuestions.' });
        }

        if (!['paunang', 'pangwakas'].includes(quizType)) {
            return res.status(400).json({ message: 'Invalid quiz type.' });
        }

        // Check if score already exists (first attempt only)
        const existingScore = await Score.findOne({
            studentId: req.user._id,
            quizType
        });

        if (existingScore) {
            return res.status(200).json({
                message: 'Naitala na ang iyong unang score. Hindi na mababago.',
                score: existingScore,
                alreadyRecorded: true
            });
        }

        const percentage = (score / totalQuestions) * 100;

        const newScore = await Score.create({
            studentId: req.user._id,
            quizType,
            score,
            totalQuestions,
            percentage
        });

        res.status(201).json({
            message: 'Matagumpay na naitala ang iyong score.',
            score: newScore,
            alreadyRecorded: false
        });
    } catch (error) {
        console.error('Score submit error:', error);
        res.status(500).json({ message: 'May error sa server.' });
    }
});

// GET /api/scores/me — Get current student's scores
router.get('/me', verifyToken, requireRole('student'), async (req, res) => {
    try {
        const scores = await Score.find({ studentId: req.user._id });
        const paunang = scores.find(s => s.quizType === 'paunang') || null;
        const pangwakas = scores.find(s => s.quizType === 'pangwakas') || null;

        res.json({ paunang, pangwakas });
    } catch (error) {
        res.status(500).json({ message: 'May error sa server.' });
    }
});

module.exports = router;
