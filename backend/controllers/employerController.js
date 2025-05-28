const Models = require('../models/Models')
const Services = require('../services/services')

const EmployerController = {

    // манипуляции с вакансиями компании
    createVacancy: async (req, res) => {
        const user_id = req.user.id
        const { vacancy } = req.body

        const newVacancy = await Services.Vacancy.addVacancy(user_id, vacancy)
        return res.status(200).json({
            success: true,
            message: 'Вакансия сохдана',
            data: newVacancy
        })
    },
    editVacancy: async (req, res) => {
        const user_id = req.user.id
        const vacancy_id = req.params.id
        const { vacancy } = req.body

        const editedVacancy = await Services.Vacancy.editVacancy(user_id, vacancy_id, vacancy)
        return res.status(200).json({
            success: true,
            message: 'Вакансия изменена',
            data: editedVacancy
        })
    },
    deleteVacancy: async (req, res) => {
        const user_id = req.user.id
        const vacancy_id = req.params.id

        const deletedVacancy = await Services.Vacancy.deleteVacancy(user_id, vacancy_id)
        return res.status(200).json({
            success: true,
            message: 'Вакансия удалена',
            data: deletedVacancy.id
        })
    },
    getCompanyVacancies: async (req, res) => {
        const user_id = req.user.id

        const vacancies = await Services.Employer.getCompanyVacancies(user_id)
        return res.status(200).json({
            success: true,
            message: 'Вакансии найдены',
            data: vacancies
        })
    },
    getVacancy: async (req, res) => {
        const vacancyId = req.params.id
        const vacancy = await Services.Vacancy.getVacancy(vacancyId)
        return res.status(200).json({
            success: true,
            message: 'Вакансия найдена',
            data: vacancy
        })
    },

    // манипуляции с откликами пользователей
    getResponsesForVacancy: async (req, res) => {
        const user_id = req.user.id
        const vacancy_id = req.params.id
        const vacancies = await Services.Response.getResponsesForVacancy(user_id, vacancy_id)
        return res.status(200).json({
            success: true,
            message: 'Вакансии найдены',
            data: vacancies
        })
    },
    rejectUserResponse: async (req, res) => {
        const user_id = req.user.id
        const response_id = req.params.id
        const { message } = req.body
        const response = await Services.Response.rejectResponse(user_id, response_id, message)
        return res.status(200).json({
            success: true,
            message: 'Отклик отказан',
            data: response
        })
    },
    approveUserResponse: async (req, res) => {
        const user_id = req.user.id
        const response_id = req.params.id
        const { message } = req.body

        const response = await Services.Response.approveResponse(user_id, response_id, message)
        return res.status(200).json({
            success: true,
            message: 'Отклик одобрен',
            data: response
        })
    },

    // получение резюме пользователей оставивших отклик на вакансию
    getResponsedUsers: async (req, res) => {
        const user_id = req.user.id
        const vacancy_id = req.params.id
        const responses = await Services.Response.getResponsesForVacancy(user_id, vacancy_id)
        return res.status(200).json({
            success: true,
            message: 'Отклики найдены',
            data: responses
        })
    },


    getProfile: async (req, res) => {
        const user_id = req.user.id
        const profile = await Services.Employer.getEmployerProfile(user_id)
        return res.status(200).json({
            success: true,
            message: 'Профиль получен',
            data: profile
        })
    },
    editProfile: async (req, res) => {
        const user_id = req.user.id
        const profile = req.body.profile
        const newProfile = await Services.Employer.editEmployerProfile(user_id, profile)

        return res.status(200).json({
            success: true,
            message: 'Профиль получен',
            data: newProfile
        })
    },

    sendJoinCompanyRequest: async (req, res) => {
        const user_id = req.user.id
        const { request } = req.body
        const employer = await Services.JoinCompanyrequest.sendRequest(user_id, request)
        return res.status(200).json({
            success: true,
            message: 'Запрос отправлен',
            data: employer
        })
    },
    cancelJoinCompanyRequest: async (req, res) => {
        const user_id = req.user.id
        const { company_regnum } = req.body
        const employer = await Services.JoinCompanyrequest.cancelRequest(user_id, company_regnum)
        return res.status(200).json({
            success: true,
            message: 'Запрос отменен',
            data: employer
        })
    },
    leaveCompany: async (req, res) => {
        const user_id = req.user.id
        const employer = await Services.Employer.leaveCompany(user_id)
        return res.status(204).json({
            success: true,
            message: 'Работодатель вышел из компании',
        })
    },
}

module.exports = EmployerController