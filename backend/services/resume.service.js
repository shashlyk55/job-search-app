const AppError = require('../errors/AppError')
const Repositories = require('../repositories/repositories')

const ResumeService = {
    getApplicantResumes: async function (userId) {
        const applicant = await Repositories.Applicant.getByUserId(userId)
        const applicantId = applicant._id
        const resumes = await Repositories.Resume.getApplicantResumes(applicantId)
        return resumes
    },
    getResume: async function (userId, resumeId) {
        const resume = await Repositories.Resume.getOne(resumeId)
        if (!resume) {
            throw new AppError(404, 'Резюме не найдено')
        }
        if (!await Repositories.Resume.checkResumeOwner(userId, resumeId)) {
            throw new AppError(403, 'Пользователь не является владельцем резюме')
        }
        return resume
    },
    createResume: async function (userId, resume) {
        const applicant = await Repositories.Applicant.getByUserId(userId)
        resume.applicant_id = applicant.id
        const newResume = await Repositories.Resume.addResume(resume)
        if (!newResume) {
            throw new AppError(500, 'Резюме не создано')
        }
        await Repositories.Applicant.addResume(userId, newResume.id)
        return newResume
    },
    editResume: async function (userId, resumeId, resume) {
        if (!await Repositories.Resume.isResumeExists(resumeId)) {
            throw new AppError(404, 'Резюме не найдено')
        }
        if (!await Repositories.Resume.checkResumeOwner(userId, resumeId)) {
            throw new AppError(403, 'Пользователь не является владельцем резюме')
        }
        const editedResume = await Repositories.Resume.editResume(resumeId, resume)
        if (!editedResume) {
            throw new AppError(500, 'Резюме не изменено')
        }
        return editedResume
    },
    deleteResume: async function (userId, resumeId) {
        if (!await Repositories.Resume.isResumeExists(resumeId)) {
            throw new AppError(404, 'Резюме не найдено')
        }
        if (!await Repositories.Resume.checkResumeOwner(userId, resumeId)) {
            throw new AppError(403, 'Пользователь не является владельцем резюме')
        }
        const deletedResume = await Repositories.Resume.deleteResume(resumeId)
        if (!deletedResume) {
            throw new AppError(500, 'Резюме не удалено')
        }
        await Repositories.Applicant.deleteResume(userId, deletedResume.id)
        return deletedResume
    },
    addWorkExp: async function (userId, resumeId, works) {
        if (!await Repositories.Resume.isResumeExists(resumeId)) {
            throw new AppError(404, 'Резюме не найдено')
        }
        if (!await Repositories.Resume.checkResumeOwner(userId, resumeId)) {
            throw new AppError(403, 'Пользователь не является владельцем резюме')
        }
        const editedResume = await Repositories.Resume.addWorkExp(resumeId, works)
        if (!editedResume) {
            throw new AppError(500, 'Резюме не обновлено')
        }
        const newWorks = editedResume.work_experience
        return newWorks
    },
    editWorkExp: async function (userId, resumeId, works) {
        if (!await Repositories.Resume.isResumeExists(resumeId)) {
            throw new AppError(404, 'Резюме не найдено')
        }
        if (!await Repositories.Resume.checkResumeOwner(userId, resumeId)) {
            throw new AppError(403, 'Пользователь не является владельцем резюме')
        }
        const editedResume = await Repositories.Resume.editWorkExp(resumeId, works)
        if (!editedResume) {
            throw new AppError(500, 'Резюме не обновлено')
        }
        const newWorks = editedResume.work_experience
        return newWorks
    },
    deleteWorkExp: async function (userId, resumeId, works) {
        if (!await Repositories.Resume.isResumeExists(resumeId)) {
            throw new AppError(404, 'Резюме не найдено')
        }
        if (!await Repositories.Resume.checkResumeOwner(userId, resumeId)) {
            throw new AppError(403, 'Пользователь не является владельцем резюме')
        }
        const editedResume = await Repositories.Resume.deleteWorkExp(resumeId, works)
        if (!editedResume) {
            throw new AppError(500, 'Резюме не обновлено')
        }
        const newWorks = editedResume.work_experience
        return newWorks
    },
}

module.exports = ResumeService
