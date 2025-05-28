const JoinCompanyRequest = require('../models/Models').JoinCompanyRequest
const Models = require('../models/Models')

const JoinCompanyRequestRepository = {
    getAll: async () => {
        const requests = await JoinCompanyRequest.find()
            .populate({
                path: 'employer',
                populate: {
                    path: 'user',
                    select: 'name contacts role'
                }
            })

        return requests
    },
    getById: async (requestId) => {
        const request = await JoinCompanyRequest.findById(requestId)
            .populate({
                path: 'employer',
                populate: {
                    path: 'user',
                    select: 'name contacts role'
                }
            })
        return request
    },
    getOne: async (employerId, company_regnum) => {
        const request = await JoinCompanyRequest.findOne({ employer: employerId, company_regnum: company_regnum })
        return request
    },
    getByEmployerId: async (employerId) => {
        const request = await JoinCompanyRequest.findOne({ employer: employerId })
        return request
    },
    delete: async (requestId) => {
        const deletedRequest = await JoinCompanyRequest.findByIdAndDelete(
            requestId,
            { new: true }
        )
        return deletedRequest
    },
    add: async (request) => {
        const newRequest = new JoinCompanyRequest(request)
        return await newRequest.save()
    },
    findDuplicate: async (employerId, regnum) => {
        const requests = await JoinCompanyRequest.find({ employer: employerId, company_regnum: regnum })
        if (!requests) {
            return []
        }
        return requests
    },
    deleteRequestForEmployer: async (employerId) => {
        const request = await JoinCompanyRequest.deleteMany({ employer: employerId })
        return request
    }
}

module.exports = JoinCompanyRequestRepository