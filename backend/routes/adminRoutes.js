const router = require('express').Router()
const Controllers = require('../controllers/controllers')
const Middleware = require('../middleware/Middleware')

router.get('/industry', Controllers.Admin.getAllIndustries)
router.post('/industry', Controllers.Admin.addIndustry)
//router.put('/industry/:id', Controllers.Admin.editIndustry)
router.delete('/industry/:id', Controllers.Admin.deleteIndustry)

router.get('/user', Controllers.Admin.getAllUsers)
router.put('/user/:id', Controllers.Admin.editUser)
router.delete('/user/:id', Controllers.Admin.deleteUser)

router.get('/vacancy', Controllers.Admin.getAllVacancies)
router.get('/vacancy/:id', Controllers.Admin.getVacancy)
router.put('/vacancy/:id', Controllers.Admin.editVacancy)
router.delete('/vacancy/:id', Controllers.Admin.deleteVacancy)

// компании подгружаются из единого государственного реестра юл и ип и админ одобряет заявки на присоединение пользователя к существующей в реестре компании
router.get('/joincompanyrequest', Controllers.Admin.getAllJoinCompanyRequests)
router.put('/joincompanyrequest/:id/approve', Controllers.Admin.approveRequest)
router.put('/joincompanyrequest/:id/reject', Controllers.Admin.rejectRequest)

module.exports = router
