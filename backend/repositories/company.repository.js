const Models = require('../models/Models')
const Company = require('../models/Models').Company

const CompanyRepository = {
    add: async (company) => {
        const newCompany = new Company(company)
        return await newCompany.save()
    },
    edit: async (companyId, company) => {
        const editedCompany = await Company.findByIdAndUpdate(
            companyId,
            { $set: company },
            { new: true }
        )
        return editedCompany
    },
    delete: async (companyId) => {
        const deletedCompany = await Company.findByIdAndDelete(
            companyId,
            { new: true }
        )
        return deletedCompany
    },
    getOne: async (companyId) => {
        const company = await Company.findById(companyId)
        return company
    },
    getAll: async () => {
        const companies = await Company.find()
        if (!companies) {
            return []
        } else {
            return companies
        }
    },
    isExists: async (companyId) => {
        return await Company.exists({ _id: companyId })
    },
    getCompanyByEmplyerId: async (employerId) => {
        const employer = await Models.Employer.findById(employerId)
            .populate('company')
        return employer.company
    },
    getCompanyByUserId: async (userId) => {
        const employer = await Models.Employer.findOne({ user: userId })
            .populate('company')
        return employer.company
    }
}

module.exports = CompanyRepository
