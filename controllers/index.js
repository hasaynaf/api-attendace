/* controllers */
const auth = require('../controllers/auth')
const employee = require('../controllers/employee')
const attendance = require('../controllers/attendance')

const controller = {}

controller.auth = auth
controller.employee = employee
controller.attendance = attendance

module.exports = controller
