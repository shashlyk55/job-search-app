const Repositories = require('../repositories/repositories')
const AppError = require('../errors/AppError')

const IndustryTypeService = {
    addIndustryType: async function (industryName) {
        if (await Repositories.IndustryType.isExists(industryName)) {
            throw new AppError(400, 'Отрасль уже существует')
        }
        const addedIndustry = await Repositories.IndustryType.add(industryName)
        return addedIndustry
    },
    deleteIndustryType: async function (industryId) {
        const industry = await Repositories.IndustryType.getOne(industryId)
        if (!await Repositories.IndustryType.isExists(industry.industry_type)) {
            throw new AppError(404, 'Отрасль не найдена')
        }
        const deletedIndustry = await Repositories.IndustryType.delete(industryId)
        return deletedIndustry
    },
    editIndustryType: async function (industryId, industryName) {
        if (!await Repositories.IndustryType.isExists(industryId)) {
            throw new AppError(404, 'Отрасль не найдена')
        }
        const editedIndustry = await Repositories.IndustryType.edit(industryId, industryName)
        return editedIndustry
    },
    getAllIndustryTypes: async function () {
        const industries = await Repositories.IndustryType.getAll()
        if (!industries) {
            return []
        }
        return industries
    }
}

module.exports = IndustryTypeService