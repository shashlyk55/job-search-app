const Models = require('../models/Models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Services = require('../services/services')

const GuestController = {
    register: async (req, res) => {
        const { userData: user } = req.body

        const result = await Services.User.register(user)
        return res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            token: result.token,
            data: result.user
        })
    },
    login: async (req, res) => {
        const { email, password } = req.body
        const result = await Services.User.login(email, password)
        return res.status(200).json({
            success: true,
            message: 'Авторизация успешна',
            token: result.token,
            data: result.user
        })
    },
    checkAuth: async (req, res) => {
        const user = await Services.User.getUser(req.user.id)

        let profile = null
        switch (user.role) {
            case ('applicant'): {
                profile = await Services.Applicant.getApplicantProfile(req.user.id)
                break
            }
            case ('employer'): {
                profile = await Services.Employer.getEmployerProfile(req.user.id)
                break
            }
            default: {

            }
        }

        return res.status(200).json({
            success: true,
            data: profile
        })

    }
}

module.exports = GuestController