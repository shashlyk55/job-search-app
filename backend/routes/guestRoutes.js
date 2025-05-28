const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/controllers');
const Middleware = require('../middleware/Middleware');

router.post('/register', Controllers.Guest.register);
router.post('/login', Controllers.Guest.login);
router.get('/auth/check', Middleware.Verify, Controllers.Guest.checkAuth)

module.exports = router