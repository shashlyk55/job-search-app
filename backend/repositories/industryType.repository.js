const IndustryType = require('../models/Models').IndustryType
const Models = require('../models/Models')

const IndustryTypeRepository = {
    getAll: async () => {
        const industries = await IndustryType.find()
        return industries
    },
    getOne: async (industryId) => {
        const industry = await IndustryType.findById(industryId)
        return industry
    },
    edit: async (industryId, industry) => {
        const editedIndustry = await IndustryType.findByIdAndUpdate(
            industryId,
            //{ $set: { industry_type: industryName } },
            { $set: { ...industry } },
            { new: true }
        )
        return editedIndustry
    },
    delete: async (industryId) => {
        const deletedIndustry = await IndustryType.findByIdAndDelete(
            industryId,
            { new: true }
        )

        return deletedIndustry
    },
    add: async (industryName) => {
        const industry = new IndustryType({ industry_type: industryName })
        return await industry.save()
    },
    isExists: async (industryName) => {
        return await IndustryType.exists({ industry_type: industryName.toLowerCase() })
        //return await IndustryType.exists({ _id: industryId })
    },

}

module.exports = IndustryTypeRepository