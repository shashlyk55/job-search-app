const Models = require('../models/Models')
const Vacancy = require('../models/Models').Vacancy

const vacancyRepository = {
    add: async (vacancy) => {
        const newVacancy = new Vacancy(vacancy)
        return (await newVacancy.save()).populate('industry_id')
    },
    getAll: async () => {
        //const vacancies = await Vacancy.find().populate('company_id industry_id')
        const vacancies = await Vacancy.find().populate('industry_id')
        return vacancies
    },
    findVacancies: async ({
        filter = {},
        sort = 'date_desc',
        page = 1,
        limit = 10,
    }) => {
        // Создаем базовый запрос
        const query = Vacancy.find(filter);

        // Применяем сортировку
        switch (sort) {
            case 'date_desc':
                query.sort({ createdAt: -1 });
                break;
            case 'salary_desc':
                query.sort({ salary_amount: -1 });
                break;
            case 'salary_asc':
                query.sort({ salary_amount: 1 });
                break;
            default:
                query.sort({ createdAt: -1 });
        }

        // Применяем пагинацию
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);

        // Выполняем запрос и получаем общее количество документов параллельно
        const [vacancies, total] = await Promise.all([
            query.exec(),
            Vacancy.countDocuments(filter),
        ]);

        if (!vacancies)
            return []

        return vacancies;

    },
    filter: async function (filter) {
        //const filteredVacancies = await Vacancy.find(filter).populate('company_id industry_id')
        const filteredVacancies = await Vacancy.find(filter).populate('industry_id')
        return filteredVacancies
    },

    getOne: async (vacancyId) => {
        //const vacancy = await Vacancy.findById(vacancyId).populate('company_id industry_id')
        const vacancy = await Vacancy.findById(vacancyId).populate('industry_id')
        return vacancy
    },
    edit: async (vacancyId, vacancy) => {
        const editedVacancy = await Vacancy.findByIdAndUpdate(
            vacancyId,
            { $set: { ...vacancy } },
            { new: true }
        )
            //.populate('company_id industry_id')
            .populate('industry_id')
        return editedVacancy
    },
    delete: async (vacancyId) => {
        const deletedResume = await Vacancy.findByIdAndDelete(
            vacancyId,
            { new: true }
        )
        return deletedResume
    },
    isExists: async (vacancyId) => {
        return await Vacancy.exists({ _id: vacancyId })
    },
    getResponsedVacancies: async (userId) => {
        const applicantId = await Models.Applicant.find({ user: userId })
        const vacancies = await Models.Response.find({ applicant_id: applicantId })
            .populate({
                path: 'vacancy_id',
                populate: {
                    path: 'industry_id'
                },
                // populate: {
                //     path: 'company_id'
                // }
            })
            .populate({
                path: 'resume_id'
            })
        if (!vacancies) {
            return []
        } else {
            return vacancies
        }
    },
    getCompanyVacancies: async (company_regnum) => {
        //const vacancies = await Models.Vacancy.find({ company_id: companyId }).populate('company_id industry_id')
        const vacancies = await Models.Vacancy.find({ 'company.company_regnum': company_regnum }).populate('industry_id')
        if (!vacancies) {
            return []
        } else {
            return vacancies
        }
    }
}

module.exports = vacancyRepository