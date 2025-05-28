const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/controllers')

router.get('/industries', Controllers.Other.getIndustries)

module.exports = router