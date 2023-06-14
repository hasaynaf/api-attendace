/* core */
const express = require('express')
const router = express.Router()
const controller = require('../controllers')

/* signin */
router.post('/signin', controller.auth.signin)

module.exports = router
