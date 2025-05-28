const Models = require('../models/Models')

const applicantRepository = {
    addApplicant: async (userId) => {
        const newApplicant = new Models.Applicant({ user: userId, resumes: [] })
        return await newApplicant.save()
    },
    isExists: async (userId) => {
        return await Models.Applicant.exists({ user: userId })
    },
    getByApplicantId: async (id) => {
        return await Models.Applicant.findById(id)
    },
    getByUserId: async (id) => {
        return await Models.Applicant.findOne({ user: id })
    },
    getProfile: async (userId) => {
        return await Models.Applicant.find({ user: userId })
            .populate('user', { password_hash: 0 })
            .populate('resumes')
    },
    editProfile: async (userId, name, contacts) => {
        return await Models.User.findByIdAndUpdate(
            userId,
            { $set: { contacts: contacts, name: name } },
            { new: true, projection: { password_hash: 0 } }
        )
    },
    getApplicantByEmail: async (email) => {
        return await Models.User.findOne({ "contacts.email": email })
    },
    getApplicantByPhone: async (phone) => {
        return await Models.User.findOne({ "contacts.phone": phone })

    },
    addResume: async (userId, resumeId) => {
        return await Models.Applicant.findOneAndUpdate(
            { user: userId },
            { $push: { resumes: resumeId } },
            { new: true }
        )
    },
    deleteResume: async (userId, resumeId) => {
        return await Models.Applicant.findOneAndUpdate(
            { user: userId },
            { $pull: { resumes: resumeId } },
            { new: true }
        )
    },
    deleteApplicant: async (userId) => {
        return await Models.Applicant.findOneAndDelete(
            { user: userId },
            { new: true }
        )
    },
}

module.exports = applicantRepository


