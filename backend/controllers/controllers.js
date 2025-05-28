const AdminController = require('./adminController')
const ApplicantController = require('./applicantController')
const EmployerController = require('./employerController')
const GuestController = require('./guestController')
const OtherController = require('./otherController')

const Controllers = {}
Controllers.Admin = AdminController
Controllers.Applicant = ApplicantController
Controllers.Employer = EmployerController
Controllers.Guest = GuestController
Controllers.Other = OtherController

module.exports = Controllers

