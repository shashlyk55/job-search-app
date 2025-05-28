const AppError = require('../errors/AppError')
const Repositories = require('../repositories/repositories')

const ApplicantService = {
    getApplicantProfile: async function (userId) {
        const profile = await Repositories.Applicant.getProfile(userId)
        if (!profile) {
            throw new AppError(404, 'Профиль не найден')
        }
        return profile
    },
    editApplicantProfile: async function (userId, profile) {
        if (!await Repositories.Applicant.isExists(userId)) {
            throw new AppError(404, 'Профиль не найден')
        }
        const applicantByEmail = await Repositories.Applicant.getApplicantByEmail(profile.contacts.email)
        if (applicantByEmail && applicantByEmail.id != userId) {
            throw new AppError(400, 'Данный email занят')
        }
        const applicantByPhone = await Repositories.Applicant.getApplicantByPhone(profile.contacts.phone)
        if (applicantByPhone && applicantByPhone.id != userId && profile.contacts.phone != '' && profile.contacts.phone != null) {
            throw new AppError(400, 'Данный телефон занят')
        }
        const editedProfile = await Repositories.Applicant.editProfile(userId, profile.name, profile.contacts)
        if (!editedProfile) {
            throw new AppError(500, 'Профиль не был изменен')
        }
        return editedProfile
    }

}

module.exports = ApplicantService