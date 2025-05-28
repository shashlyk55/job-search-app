const { User } = require('../repositories/repositories')

const EmployerMiddleware = async (req, res, next) => {
    if (await User.getRole(req.user.id) != "employer" && await User.getRole(req.user.id) != "admin") {
        return res.status(403).json({
            success: false,
            message: "Доступ запрещен"
        });
    }
    next();
};

module.exports = EmployerMiddleware