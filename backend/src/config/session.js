const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const createToken = payload => jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).send({ error: 'Invalid Token' });

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err)
            return res.status(401).send({ error: err.message });

        req.session = user;
        next();
    });
};


exports.createToken = createToken;
exports.validateToken = validateToken;