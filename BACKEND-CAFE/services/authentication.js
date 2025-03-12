require('dotenv').config()
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null)
            return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
            if (err)
                return res.sendStatus(403);
            res.locals = response;
            next()
        })
    } catch (error) {
        return res.status(400).json({success: false, msg: error.message})
    }
}

module.exports = { authenticateToken: authenticateToken }