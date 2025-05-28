const AppError = require("../errors/AppError")
const Repository = require("../repositories/repositories")

const IsUserExists = async (req, res, next) => {
    const userId = req.user.id
    if (!await Repository.User.isUserExists(userId)) {
        next(new AppError(404, 'Пользователь не найден'))
        //throw new AppError(404, 'Пользователь не найден')
    } else {
        next()
    }
}

module.exports = IsUserExists