const Models = require('../models/Models')
const Response = require('../models/Models').Response

const resumeRepository = {
    add: async (response) => {
        const newResponse = new Response(response)
        return await newResponse.save()
    },
    getAllForVacancy: async (vacancyId) => {
        const responses = await Response.find({ vacancy_id: vacancyId })
            .populate({
                path: 'resume_id'
            })
            .populate({
                path: 'applicant_id',
                populate: {
                    path: 'user',
                    select: 'name contacts'
                }
            })
            .populate({
                path: 'vacancy_id',
            });

        if (!responses) {
            return []
        } else {
            return responses
        }
    },
    getAllForUser: async (userId) => {
        const applicantId = await Models.Applicant.find({ user: userId })
        let responses = await Response.find({ applicant_id: applicantId })
            .populate({
                path: 'resume_id'
            })
            .populate({
                path: 'applicant_id',
                populate: {
                    path: 'user',
                    select: 'name contacts'
                }
            })
            .populate({
                path: 'vacancy_id',
                // populate: {
                //     path: 'company_id',
                // }
            });

        // responses = await Models.Company.populate(responses, {
        //     path: 'vacancy_id.company_id',
        // });

        if (!responses) {
            return []
        } else {
            return responses
        }
    },
    getOne: async (responseId) => {
        const response = await Response.findById(responseId)
        return response
    },
    getAll: async () => {
        const responses = await Response.find()
        if (!responses) {
            return []
        } else {
            return responses
        }
    },
    delete: async (responseId) => {
        const response = await Response.findByIdAndDelete(
            responseId,
            { new: true }
        )
        return response
    },
    edit: async (responseId, response) => {
        const editedResponse = await Response.findByIdAndUpdate(
            responseId,
            { $set: response },
            { new: true }
        )
        return editedResponse
    },
    isExists: async (responseId) => {
        return await Response.exists({ _id: responseId })
    },
    isApplicantAlreadyRespond: async (applicantId, vacancyId) => {
        const response = await Response.findOne({ applicant_id: applicantId, vacancy_id: vacancyId })
        return !!response
    },
    deleteResponsesByVacancyId: async (vacancyId) => {
        const responses = await Response.deleteMany({ vacancy_id: vacancyId })
        return responses
    },
    deleteResponsesForApplicant: async (applicantId) => {
        const responses = await Response.deleteMany({ applicant_id: applicantId })
        return responses
    }
}

module.exports = resumeRepository