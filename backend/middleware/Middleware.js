const VerifyMiddleware = require('./Auth')
const AdminMiddleware = require('./CheckAdmin')
const ErrorHandlerMiddleware = require('./ErrorHandler')
const ApplicantMiddleware = require('./CheckApplicant')
const EmployerMiddleware = require('./CheckEmployer')
const IsUserExistsMiddleware = require('./IsUserExists')


const Middleware = {}
Middleware.Verify = VerifyMiddleware
Middleware.CheckAdmin = AdminMiddleware
Middleware.Errorhandler = ErrorHandlerMiddleware
Middleware.CheckApplicant = ApplicantMiddleware
Middleware.CheckEmployer = EmployerMiddleware
Middleware.IsUserExists = IsUserExistsMiddleware

module.exports = Middleware