const Repositories = require('../repositories/repositories')

const CompanyService = {
    addCompany: async function (company) {
        const addedCompany = await Repositories.Company.add(company)
        if (!addedCompany) {
            throw new AppError(500, 'Компания не создана')
        }
        return addedCompany
    },
    editCompany: async function (companyId, company) {
        const editedCompany = await Repositories.Company.edit(companyId, company)
        if (!editedCompany) {
            throw new AppError(500, 'Компания не изменена')
        }
        return editedCompany
    },
    deleteCompany: async function (companyId) {
        const editedCompany = await Repositories.Company.edit(companyId, company)
        if (!editedCompany) {
            throw new AppError(500, 'Компания не изменена')
        }
        return editedCompany
    },
    getCompany: async function (companyId) {
        const company = await Repositories.Company.getOne(companyId)
        if (!company) {
            throw new AppError(404, 'Компания не найдена')
        }
        return company
    },
    getAllCompanies: async function () {
        const companies = await Repositories.Company.getAll()
        if (!companies) {
            throw new AppError(404, 'Компании не найдены')
        }
        return companies
    }
}

module.exports = CompanyService