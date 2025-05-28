const Models = require('../models/Models')

const employerRepository = {
    add: async (userId) => {
        const newEmployer = new Models.Employer({ user: userId })
            .populate('user', { password_hash: 0 })

        return (await newEmployer).save()
    },
    // edit: async (userId, employer) => {
    //     const editedEmployer = await Models.Employer.findOneAndUpdate(
    //         { user: userId },
    //         { $set: { employer } },
    //         { new: true }
    //     )
    //         .populate('user', { password_hash: 0 })
    //     return editedEmployer
    // },
    delete: async (employerId) => {
        const deletedEmployer = await Models.Employer.findByIdAndDelete(
            employerId,
            { new: true }
        )
        return deletedEmployer
    },
    getByEmployerId: async (employerId) => {
        const employer = await Models.Employer.findById(employerId)
            .populate('user', { password_hash: 0 })
        return employer
    },
    getOne: async (userId) => {
        const employer = await Models.Employer.findOne({ user: userId })
            .populate('user', { password_hash: 0 })
        return employer
    },
    getAll: async () => {
        const employers = await Models.Employer.find()
            .populate('user', { password_hash: 0 })
        if (!employers) {
            return []
        } else {
            return employers
        }
    },
    editProfile: async (userId, name, contacts) => {
        return await Models.User.findByIdAndUpdate(
            userId,
            { $set: { contacts: contacts, name: name } },
            { new: true, projection: { password_hash: 0 } }
        )
    },
    getProfile: async (userId) => {
        const employer = await Models.Employer.findOne({ user: userId })
            //.populate('company')
            .populate('user', { password_hash: 0 })
        return employer
    },
    editEmployerCompany: async (userId, company, requested_company) => {
        const employer = await Models.Employer.findOneAndUpdate(
            { user: userId },
            { $set: { company: company, requested_company: requested_company } },
            { new: true }
        )
            .populate('user', { password_hash: 0 })
        return employer
    }
}

module.exports = employerRepository