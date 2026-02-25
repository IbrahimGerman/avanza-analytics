// src/controllers/authController.js
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { username, password } = req.body;

    // Mock Authentication - In production check against DB
    if (username === 'admin' && password === 'admin') {
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';
        const token = jwt.sign(
            { user_id: 1, username },
            secret,
            { expiresIn: "2h" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: { username, role: "admin" }
        });
    }

    return res.status(400).send("Invalid Credentials");
};

module.exports = { login };
