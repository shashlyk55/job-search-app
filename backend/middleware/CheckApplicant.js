const { User } = require('../repositories/repositories')

const ApplicantMiddleware = async (req, res, next) => {
    if (await User.getRole(req.user.id) != 'applicant' && await User.getRole(req.user.id) != 'admin') {
        return res.status(403).json({
            success: false,
            message: "Доступ запрещен"
        });
    }
    next();
};

module.exports = ApplicantMiddleware