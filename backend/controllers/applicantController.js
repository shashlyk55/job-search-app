const mongoose = require('mongoose')
const Models = require('../models/Models')
const Services = require('../services/services')
require('express-async-errors')

const ApplicantController = {
    // ведение профиля пользователя
    getProfile: async (req, res, next) => {
        try {
            const profile = await Services.Applicant.getApplicantProfile(req.user.id)

            return res.status(200).json({
                success: true,
                message: 'Профиль найден',
                data: profile
            })
        } catch (err) {
            next(err)
        }
    },
    editProfile: async (req, res, next) => {
        try {
            const editedProfile = await Services.Applicant.editApplicantProfile(req.user.id, req.body.profile)
            return res.status(200).json({
                success: true,
                message: 'Профиль изменен',
                data: editedProfile
            })
        } catch (err) {
            next(err)
        }
    },

    // манипуляции с резюме
    createResume: async (req, res, next) => {
        try {
            const userId = req.user.id
            const resume = req.body.resume
            const newResume = await Services.Resume.createResume(userId, resume)

            return res.status(200).json({
                success: true,
                message: 'Резюме создано',
                data: newResume
            })
        } catch (err) {
            next(err)
        }

    },
    getAllResumes: async (req, res, next) => {
        try {
            const userId = req.user.id
            const resumes = await Services.Resume.getApplicantResumes(userId)
            if (!resumes) {
                return res.status(200).json({
                    success: true,
                    message: 'Резюме не найдены',
                    data: resumes
                })
            }
            return res.status(200).json({
                success: true,
                message: 'Резюме получены',
                data: resumes
            })
        } catch (err) {
            next(err)
        }
    },
    getResume: async (req, res, next) => {
        try {
            const userId = req.user.id
            const resumeId = req.params.id
            const resume = await Services.Resume.getResume(userId, resumeId)
            return res.status(200).json({
                success: true,
                message: 'Резюме получено',
                data: resume
            })
        } catch (err) {
            next(err)
        }
    },
    editResume: async (req, res, next) => {
        try {
            const resumeId = req.params.id
            const userId = req.user.id
            const newResume = req.body.resume
            const editedResume = await Services.Resume.editResume(userId, resumeId, newResume)
            return res.status(200).json({
                success: true,
                message: 'Резюме изменено',
                data: editedResume
            })
        } catch (err) {
            next(err)
        }
    },
    deleteResume: async (req, res, next) => {
        try {
            const userId = req.user.id
            const resumeId = req.params.id
            const deletedResume = await Services.Resume.deleteResume(userId, resumeId)

            return res.status(200).json({
                success: true,
                message: 'Резюме удалено',
                data: deletedResume.id
            })
        } catch (err) {
            next(err)
        }
    },
    addWorkExperience: async (req, res, next) => {
        try {
            const resumeId = req.params.id
            const userId = req.user.id
            const newWorks = req.body

            const works = await Services.Resume.addWorkExp(userId, resumeId, newWorks)

            return res.status(200).json({
                success: true,
                message: 'Резюме обновлено',
                data: works
            })
        } catch (err) {
            next(err)
        }
    },
    editWorkExperience: async (req, res, next) => {
        try {
            const resumeId = req.params.id
            const userId = req.user.id
            const works = req.body
            const newWorks = await Services.Resume.editWorkExp(userId, resumeId, works)
            return res.status(200).json({
                success: true,
                message: 'Резюме обновлено',
                data: newWorks
            })

        } catch (err) {
            next(err)
        }
    },
    deleteWorkExperience: async (req, res, next) => {
        try {
            const resumeId = req.params.id
            const userId = req.user.id
            const deleteWorks = req.body
            const deletedWorks = await Services.Resume.deleteWorkExp(userId, resumeId, deleteWorks)
            return res.status(200).json({
                success: true,
                message: 'Резюме изменено',
                data: deletedWorks
            })
        } catch (err) {
            next(err)
        }
    },

    // поиск, фильтрация и сортировка вакансий
    getAllVacancies: async (req, res, next) => {
        try {
            const vacancies = await Services.Vacancy.getVacancies(req.query)

            return res.status(200).json({
                success: true,
                message: 'Вакансии найдены',
                data: vacancies
            })
        } catch (err) {
            next(err)
        }
    },
    getVacancy: async (req, res, next) => {
        try {
            const vacancyId = req.params.id
            const vacancy = await Services.Vacancy.getVacancy(vacancyId)
            return res.status(200).json({
                success: true,
                message: 'Вакансия найдена',
                data: vacancy
            })
        } catch (err) {
            next(err)
        }
    },

    // манипуляции с откликами
    doResponse: async (req, res, next) => {
        try {
            const userId = req.user.id
            const response = req.body.response
            const newResponse = await Services.Response.doResponse(userId, response)
            return res.status(200).json({
                success: true,
                message: 'Отклик отменен',
                data: newResponse
            })
        } catch (err) {
            next(err)
        }
    },
    cancelResponse: async (req, res, next) => {
        try {
            const userId = req.user.id
            const responseId = req.params.id
            const canceledResponse = await Services.Response.cancelResponse(userId, responseId)
            return res.status(200).json({
                success: true,
                message: 'Отклик отменен',
                data: canceledResponse
            })
        } catch (err) {
            next(err)
        }
    },

    // просмотр вакансий на которые дан отклик
    getResponsedVacancies: async (req, res, next) => {
        try {
            const userId = req.user.id
            const vacancies = await Services.Vacancy.getResponsedVacancies(userId)
            return res.status(200).json({
                success: true,
                message: 'Вакансии найдены',
                data: vacancies
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ApplicantController