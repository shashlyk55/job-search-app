const Services = require('../services/services')

const AdminController = {
    getAllIndustries: async (req, res) => {
        const industries = await Services.IndustryType.getAllIndustryTypes()
        return res.status(200).json({
            success: true,
            data: industries,
            message: 'Отрасли получены'
        })
    },
    addIndustry: async (req, res) => {
        const { industry } = req.body
        const newIndustry = await Services.IndustryType.addIndustryType(industry)
        return res.status(200).json({
            success: true,
            data: newIndustry,
            message: 'Отрась добавлена'
        })
    },
    editIndustry: async (req, res) => {
        const industryId = req.params.id
        const { industry } = req.body
        const editedIndustry = await Services.IndustryType.editIndustryType(industryId, industry)
        return res.status(200).json({
            success: true,
            data: editedIndustry,
            message: 'Отрасль изменена'
        })
    },
    deleteIndustry: async (req, res) => {
        const industryId = req.params.id
        const deletedIndustry = await Services.IndustryType.deleteIndustryType(industryId)
        return res.status(200).json({
            success: true,
            data: deletedIndustry.id,
            message: 'Отрасль удалена'
        })
    },
    getAllUsers: async (req, res) => {
        const users = await Services.User.getAllUsers()
        return res.status(200).json({
            success: true,
            data: users,
            message: 'Пользователи получены'
        })
    },
    getUser: async (req, res) => {
        const userId = req.params.id
        const user = await Services.User.getUser(userId)
        return res.status(200).json({
            success: true,
            data: user,
            message: 'Пользователь получен'
        })
    },
    editUser: async (req, res) => {
        const userId = req.params.id
        const { user } = req.body
        const editedUser = await Services.User.editUser(userId, user)
        return res.status(200).json({
            success: true,
            data: editedUser,
            message: 'Пользователь изменен'
        })
    },
    deleteUser: async (req, res) => {
        const userId = req.params.id
        const deletedUser = await Services.User.deleteUser(userId)
        return res.status(200).json({
            success: true,
            data: deletedUser,
            message: 'Пользователь удален'
        })
    },
    getAllVacancies: async (req, res, next) => {
        try {
            const vacancies = await Services.Vacancy.getVacancies(req.query)
            return res.status(200).json({
                success: true,
                message: 'Вакансии найдены',
                data: vacancies
            })
        } catch (err) {
            next(err)
        }
    },
    getVacancy: async (req, res, next) => {
        try {
            const vacancyId = req.params.id
            const vacancy = await Services.Vacancy.getVacancy(vacancyId)
            return res.status(200).json({
                success: true,
                message: 'Вакансия найдена',
                data: vacancy
            })
        } catch (err) {
            next(err)
        }
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

    getAllJoinCompanyRequests: async (req, res) => {
        const userId = req.user.id
        const requests = await Services.JoinCompanyrequest.getAll(userId)
        return res.status(200).json({
            success: true,
            message: 'Запросы получены',
            data: requests
        })
    },
    approveRequest: async (req, res) => {
        const request_id = req.params.id
        const company = await Services.JoinCompanyrequest.approveRequest(request_id)
        return res.status(200).json({
            success: true,
            message: 'Запрос одобрен',
            data: company
        })
    },
    rejectRequest: async (req, res) => {
        const request_id = req.params.id
        await Services.JoinCompanyrequest.rejectRequest(request_id)
        res.status(200).json({
            success: true,
            message: 'Запорос отклонен'
        })
    },
}

module.exports = AdminController