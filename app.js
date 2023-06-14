/* core */
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const fs = require("fs")
const rfs = require("rotating-file-stream")
const routes = require('./routes')

/* main */
const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(helmet())
app.use('/api/auth', routes.auth)
app.use('/api/employee', routes.employee)
app.use('/api/attendance', routes.attendance)

// create folder logs
const logDirectory = path.join(__dirname, "logs")
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create log
const accessLogStream = rfs.createStream("access.log", {
	interval: "1d",
	path: logDirectory,
})

//dev logging middleware
if (['DEV', 'QA'].includes(process.env.NODE_ENV)) {
	app.use(logger("dev"))
}
else {
	app.use(logger("combined", { stream: accessLogStream }))
}

//use a middleware function for timezone
app.use((req, res, next) => {
	req.timeZone = req.headers.timezone || 'Asia/Jakarta'
	next()
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'DEV' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
