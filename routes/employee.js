/* core */
const express = require('express')
const router = express.Router()
const controller = require('../controllers')
const {verifyToken} = require('../middleware/auth.jwt')

/* employee */
router.get('/all', verifyToken, controller.employee.getAll)
router.get('/byId', verifyToken, controller.employee.getById)
router.post('/create', verifyToken, controller.employee.create)
router.put('/update', verifyToken, controller.employee.update)
router.delete('/delete', verifyToken, controller.employee.delete)

module.exports = router
