const AppError = require('../errors/AppError')
const Repository = require('../repositories/repositories')
const Repositories = require('../repositories/repositories')

const EmployerService = {
    getEmployerProfile: async function (userId) {
        const profile = await Repositories.Employer.getProfile(userId)
        if (!profile) {
            throw new AppError(404, 'Профиль не найден')
        }
        return profile
    },
    editEmployerProfile: async function (userId, profile) {
        const editedEmployer = await Repositories.Employer.editProfile(userId, profile.name, profile.contacts)
        if (!editedEmployer) {
            throw new AppError(404, 'Профиль не изменен')
        }
        return editedEmployer
    },
    getCompanyVacancies: async function (userId) {
        const employer = await Repositories.Employer.getOne(userId)
        if (!employer.company) {
            throw new AppError(400, 'Работодатель не состоит в компании')
        }
        const vacancies = await Repositories.Vacancy.getCompanyVacancies(employer.company.company_regnum)
        vacancies.map(async (vacancy) => {
            const responses = await Repositories.Response.getAllForVacancy(vacancy.id)
            vacancy.responses_count = responses.length
        })
        if (!vacancies) {
            throw new AppError(404, 'Вакансии не найдены')
        }
        return vacancies
    },
    joinCompany: async function (userId, company) {
        const editedEmployer = await Repositories.Employer.editEmployerCompany(userId, company, null)
        if (!editedEmployer) {
            throw new AppError(500, 'Ошибка присоединения к компании')
        }
        return editedEmployer
    },
    leaveCompany: async function (userId) {
        const editedEmployer = await Repositories.Employer.editEmployerCompany(userId, null, null)
        if (!editedEmployer) {
            throw new AppError(500, 'Ошибка выхода работодателя из компании')
        }
        return editedEmployer
    }
}


module.exports = EmployerService