const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/controllers')
const Middleware = require('../middleware/Middleware')

// манипуляции с вакансиями компании
router.post('/vacancy', Controllers.Employer.createVacancy)
// получить все вакансии компании
router.get('/vacancy/company', Controllers.Employer.getCompanyVacancies)
router.get('/vacancy/:id', Controllers.Employer.getVacancy)
router.put('/vacancy/:id', Controllers.Employer.editVacancy)
router.delete('/vacancy/:id', Controllers.Employer.deleteVacancy)

// получение всех откликов пользователей для вакансии с id
router.get('/response/:id', Controllers.Employer.getResponsesForVacancy)

// отклонение и одобрение откликов
router.put('/response/:id/approve', Controllers.Employer.approveUserResponse)
router.put('/response/:id/reject', Controllers.Employer.rejectUserResponse)

router.get('/profile', Controllers.Employer.getProfile)
router.put('/profile', Controllers.Employer.editProfile)

// отправка запросов на присоединение к компании из ЕГР
router.post('/joincompanyrequest', Controllers.Employer.sendJoinCompanyRequest)
router.delete('/joincompanyrequest', Controllers.Employer.cancelJoinCompanyRequest)
router.put('/leavecompany', Controllers.Employer.leaveCompany)



module.exports = router