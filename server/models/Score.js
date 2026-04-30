const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizType: {
        type: String,
        enum: ['paunang', 'pangwakas'],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Compound unique index: only one score per student per quiz type
scoreSchema.index({ studentId: 1, quizType: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
