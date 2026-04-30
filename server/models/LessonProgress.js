const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessonId: {
        type: String,
        enum: ['aralin1', 'aralin2', 'aralin3'],
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    },
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// One progress record per student per lesson
lessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
