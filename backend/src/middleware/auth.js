// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1] || token;

        // For demo purposes, if secret is missing, we skip verification or use default
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';

        const decoded = jwt.verify(bearerToken, secret);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

module.exports = verifyToken;
