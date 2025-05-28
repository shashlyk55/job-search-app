const AppError = require('../errors/AppError')
const Repositories = require('../repositories/repositories')

const ResponseService = {
    getResponse: async function (responseId) {
        const response = await Repositories.Response.getOne(responseId)
        if (!response) {
            throw new AppError(404, 'Отклик не найден')
        }
        return response
    },
    getAllResponses: async function () {
        const responses = await Repositories.Response.getAll()
        if (!responses) {
            throw new AppError(404, 'Отклики не найдены')
        }
        return responses
    },
    doResponse: async function (userId, response) {
        if (!await Repositories.Vacancy.isExists(response.vacancy_id)) {
            throw new AppError(404, 'Вакансия не найдена')
        }
        const applicantId = await Repositories.Applicant.getByUserId(userId)
        response.applicant_id = applicantId
        response.employer_pinned_message = null
        response.is_approved = null
        if (await Repositories.Response.isApplicantAlreadyRespond(applicantId, response.vacancy_id)) {
            throw new AppError(400, 'Пользователь уже дал отклик на эту вакансию')
        }
        const newResponse = await Repositories.Response.add(response)
        if (!newResponse) {
            throw new AppError(500, 'Отклик не был произведен')
        }
        return newResponse
    },
    cancelResponse: async function (userId, responseId) {
        if (!await Repositories.Response.isExists(responseId)) {
            throw new AppError(404, 'Отклик не найден')
        }
        const applicantId = await Repositories.Applicant.getByUserId(userId)
        const response = await Repositories.Response.getOne(responseId)
        if (!await Repositories.Response.isApplicantAlreadyRespond(applicantId, response.vacancy_id)) {
            throw new AppError(400, 'Пользователь не давал отклик на эту вакансию')
        }
        const deletedResponse = await Repositories.Response.delete(responseId)
        if (!deletedResponse) {
            throw new AppError(500, 'Отклик не отменен')
        }
        const deletedId = deletedResponse.id
        return deletedId
    },
    getResponsesForVacancy: async function (userId, vacancyId) {
        if (!await Repositories.Vacancy.isExists(vacancyId)) {
            throw new AppError(404, 'Вакансия не найдена')
        }
        const responses = await Repositories.Response.getAllForVacancy(vacancyId)
        if (!responses) {
            throw new AppError(404, 'Отклики не найдены')
        }
        return responses
    },
    getResponsesForUser: async function (userId) {
        const responses = await Repositories.Response.getAllForUser(userId)
        if (!responses) {
            throw new AppError(404, 'Отклики не найдены')
        }
        return responses
    },
    rejectResponse: async function (userId, responseId, pinnedMessage) {
        const response = await Repositories.Response.getOne(responseId)
        if (!response) {
            throw new AppError(404, 'Отклик не найден')
        }
        response.is_approved = false
        response.employer_pinned_message = pinnedMessage
        const editedResponse = await Repositories.Response.edit(responseId, response)
        if (!editedResponse) {
            throw new AppError(500, 'Отклик не был одобрен')
        }
        return editedResponse
    },
    approveResponse: async function (userId, responseId, pinnedMessage) {
        const response = await Repositories.Response.getOne(responseId)
        if (!response) {
            throw new AppError(404, 'Отклик не найден')
        }
        response.is_approved = true
        response.employer_pinned_message = pinnedMessage
        const editedResponse = await Repositories.Response.edit(responseId, response)
        if (!editedResponse) {
            throw new AppError(500, 'Отклик не был одобрен')
        }
        return editedResponse
    },
    // getResponsesCount: async function (userId, vacancyId) {
    //     const responses = await 
    // }
}

module.exports = ResponseService
