const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    schoolId: {
        type: String,
        required: [true, 'School ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'School name is required'],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('School', schoolSchema);
