/* routes */
const auth = require('../routes/auth')
const employee = require('../routes/employee')
const attendance = require('../routes/attendace')

module.exports = {
    auth : auth,
    employee : employee,
    attendance : attendance
}