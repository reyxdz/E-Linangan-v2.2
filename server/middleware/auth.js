const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Hindi awtorisado. Walang token.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Hindi awtorisado. Hindi natagpuan ang user.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Nag-expire na ang session. Mag-login muli.' });
        }
        return res.status(401).json({ message: 'Hindi awtorisado. Invalid token.' });
    }
};

// Role-based access control
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Hindi awtorisado.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bawal. Walang sapat na pahintulot.' });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };
