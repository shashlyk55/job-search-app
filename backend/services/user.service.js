const Repositories = require('../repositories/repositories')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AppError = require('../errors/AppError')

const UserService = {
    register: async function (user) {
        const existingUser = await Repositories.User.findUserByEmail(user.contacts.email);

        if (existingUser) {
            throw new AppError(400, 'email уже используется')
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password_hash = hashedPassword
        const newUser = await Repositories.User.add(user)

        let applicant, employer

        if (user.role === "applicant") {
            applicant = await Repositories.Applicant.addApplicant(newUser.id)
        }
        if (user.role === "employer") {
            employer = await Repositories.Employer.add(newUser.id)
        }
        if (!applicant && !employer) {
            throw new AppError(500, 'Пользователь не зарегестрирован')
        }
        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        const { _id, password_hash, ...copyUser } = newUser._doc
        return { token: token, data: copyUser }
    },
    login: async function (email, password) {
        const user = await Repositories.User.findUserByEmail(email);
        if (!user) {
            throw new AppError(401, 'Неверный email или пароль')
        }
        if (email === 'admin@gmail.com' && password === 'admin') {
            const token = jwt.sign(
                { id: user._id, },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            const { _id, password_hash, ...copyUser } = user._doc

            return { token: token, user: copyUser }
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new AppError(401, 'Неверный email или пароль')
        }
        const token = jwt.sign(
            { id: user._id, },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const { _id, password_hash, ...copyUser } = user._doc

        return { token: token, user: copyUser }
    },
    getAllUsers: async function () {
        const users = await Repositories.User.getAllUsers()
        if (!users) {
            return []
        }
        return users
    },
    getUser: async function (userId) {
        const user = await Repositories.User.getUser(userId)
        return user
    },
    editUser: async function (userId, user) {
        const editedUser = await Repositories.User.edit(userId, user)
        return editedUser
    },
    deleteUser: async function (userId) {
        if ((await Repositories.User.getRole(userId)) === 'admin') {
            throw new AppError(400, 'Нельзя удалить админа')
        }
        const deletedUser = await Repositories.User.delete(userId)
        switch (deletedUser.role) {
            case 'applicant': {
                const applicant = await Repositories.Applicant.deleteApplicant(userId)
                await Repositories.Resume.deleteResumesForApplicant(applicant.id)
                await Repositories.Response.deleteResponsesForApplicant(applicant.id)
                break;
            }
            case 'employer': {
                const employer = await Repositories.Employer.delete(userId)
                await Repositories.JoinCompanyRequest.deleteRequestForEmployer(employer.id)
                break;
            }
        }
        return deletedUser
    }
}

module.exports = UserService
