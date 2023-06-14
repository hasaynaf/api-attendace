/* core */
const express = require('express')
const router = express.Router()
const controller = require('../controllers')
const {verifyToken} = require('../middleware/auth.jwt')

/* attendance */
router.get('/all', verifyToken, controller.attendance.getAll)
router.get('/byId', verifyToken, controller.attendance.getById)
router.post('/in', verifyToken, controller.attendance.in)
router.post('/out', verifyToken, controller.attendance.out)

module.exports = router
