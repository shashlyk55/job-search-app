const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/controllers')
const Middleware = require('../middleware/Middleware')

// ведение профиля пользователя
//router.put('/contacts', Middleware.Verify, Controllers.Applicant.editContacts);
//router.put('/name', Middleware.Verify, Controllers.Applicant.editName)
router.get('/profile', Controllers.Applicant.getProfile)
router.put('/profile', Controllers.Applicant.editProfile)

// манипуляции с резюме
router.post('/resume', Controllers.Applicant.createResume)
router.get('/resume', Controllers.Applicant.getAllResumes)
router.get('/resume/:id', Controllers.Applicant.getResume)
router.put('/resume/:id', Controllers.Applicant.editResume)
router.delete('/resume/:id', Controllers.Applicant.deleteResume)

//
router.post('/resume/:id/works', Controllers.Applicant.addWorkExperience)
router.put('/resume/:id/works', Controllers.Applicant.editWorkExperience)
router.delete('/resume/:id/works', Controllers.Applicant.deleteWorkExperience)

// поиск, фильтрация и сортировка вакансий
router.get('/vacancy', Controllers.Applicant.getAllVacancies)
router.get('/vacancy/:id', Controllers.Applicant.getVacancy)

// манипуляции с откликами
router.post('/response', Controllers.Applicant.doResponse)
router.delete('/response/:id', Controllers.Applicant.cancelResponse)

// просмотр вакансий на которые дан отклик
router.get('/responsedvacancies', Controllers.Applicant.getResponsedVacancies)


module.exports = router