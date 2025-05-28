const AppError = require('../errors/AppError');
const Repositories = require('../repositories/repositories');

const VacancyService = {
    getVacancies: async function (options) {
        const { vacancy, min_salary, industry, max_experience, sort } = options
        let filter = {}

        if (vacancy) {
            filter.name = { $regex: vacancy, $options: "i" };
        }
        if (min_salary) {
            filter.salary_amount = { $gte: parseInt(min_salary, 10) };
        }
        if (industry) {
            filter.industry_id = industry;
        }
        if (max_experience) {
            const maxExpNumber = parseInt(max_experience, 10);
            if (maxExpNumber == 0) {
                filter.$or = [
                    { required_experience: { $gte: 0 } }, // Вакансии с опытом 0 лет
                    { required_experience: null } // Вакансии, где опыт не требуется (null)
                ];
            } else if (maxExpNumber) {
                filter.required_experience = { $gte: maxExpNumber };
            }
            //filter.required_experience = { $gte: parseInt(max_experience, 10) };
        }

        //let vacancies = await Repositories.Vacancy.filter(filter)

        // switch (sort) {
        //     case "date_desc":
        //         vacancies = vacancies.sort({ createdAt: -1 }); // Новые сверху
        //         break;
        //     case "salary_desc":
        //         vacancies = vacancies.sort({ salary_amount: -1 }); // Высокая зарплата сверху
        //         break;
        //     case "salary_asc":
        //         vacancies = vacancies.sort({ salary_amount: 1 }); // Низкая зарплата сверху
        //         break;
        // }
        const vacancies = await Repositories.Vacancy.findVacancies({ filter, sort })

        if (!vacancies) {
            return []
        }
        return vacancies
    },
    getVacancy: async function (vacancyId) {
        const vacancy = await Repositories.Vacancy.getOne(vacancyId)
        if (!vacancy) {
            throw new AppError(404, 'Вакансия не найдена')
        }
        return vacancy
    },
    addVacancy: async function (userId, vacancy) {
        const employer = await Repositories.Employer.getOne(userId)
        if (!employer) {
            throw new AppError(404, 'Пользователь не найден')
        }
        if (!employer.company) {
            throw new AppError(400, 'Работодатель без компании')
        }
        vacancy.company = employer.company
        const newVacancy = await Repositories.Vacancy.add(vacancy)
        if (!newVacancy) {
            throw new AppError(500, 'Вакансия не добавлена')
        }
        return newVacancy
    },
    editVacancy: async function (userId, vacancyId, newVacancy) {
        if (!await Repositories.Vacancy.isExists(vacancyId)) {
            throw new AppError(404, 'Вакансия не найдена')
        }

        // админ тоже может изменять вакансии
        const userRole = await Repositories.User.getRole(userId)
        if (userRole == 'admin') {
            const editedVacancy = await Repositories.Vacancy.edit(vacancyId, newVacancy)
            if (!editedVacancy) {
                throw new AppError(500, 'Вакансия не изменена')
            }
            return editedVacancy
        }

        const employer = await Repositories.Employer.getOne(userId)
        if (!employer) {
            throw new AppError(404, 'Пользователь не найден')
        }
        const vacancy = await Repositories.Vacancy.getOne(vacancyId)
        if (employer.company.company_regnum != vacancy.company.company_regnum) {
            throw new AppError(400, 'Вакансия не принадлежит компании работодателя')
        }
        const editedVacancy = await Repositories.Vacancy.edit(vacancyId, newVacancy)
        if (!editedVacancy) {
            throw new AppError(500, 'Вакансия не изменена')
        }
        return editedVacancy
    },
    deleteVacancy: async function (userId, vacancyId) {
        if (!await Repositories.Vacancy.isExists(vacancyId)) {
            throw new AppError(404, 'Вакансия не найдена')
        }

        // админ тоже может удалять вакансии
        const userRole = await Repositories.User.getRole(userId)
        if (userRole == 'admin') {
            const deletedVacancy = await Repositories.Vacancy.delete(vacancyId)
            if (!deletedVacancy) {
                throw new AppError(500, 'Вакансия не удалена')
            }
            return deletedVacancy
        }

        const employer = await Repositories.Employer.getOne(userId)
        if (!employer) {
            throw new AppError(404, 'Пользователь не найден')
        }

        const vacancy = await Repositories.Vacancy.getOne(vacancyId)
        if (employer.company.company_regnum != vacancy.company.company_regnum) {
            throw new AppError(400, 'Вакансия не принадлежит компании работодателя')
        }
        const deletedVacancy = await Repositories.Vacancy.delete(vacancyId)
        if (!deletedVacancy) {
            throw new AppError(500, 'Вакансия не удалена')
        }
        const responses = await Repositories.Response.deleteResponsesByVacancyId(vacancyId)
        return deletedVacancy
    },
    getResponsedVacancies: async function (userId) {
        const vacancies = await Repositories.Vacancy.getResponsedVacancies(userId)
        if (!vacancies) {
            throw new AppError(404, 'Вакансии не найдены')
        }
        return vacancies
    }
}

module.exports = VacancyService