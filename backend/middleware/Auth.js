const jwt = require('jsonwebtoken')

const Verify = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1] || req.header("Authorization");
    if (!token) {
        return res.status(401).json(
            {
                success: false,
                message: "Нет доступа, авторизуйтесь"
            }
        );
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json(
            {
                success: false,
                message: "Неверный токен"
            }
        );
    }
};

module.exports = Verify
