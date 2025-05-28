const ApplicantRoutes = require('./applicantRoutes')
const GuestRoutes = require('./guestRoutes')
const AdminRoutes = require('./adminRoutes')
const EmployerRoutes = require('./employerRoutes')
const OtherRoutes = require('./otherRoutes')


const Routes = {}
Routes.Guest = GuestRoutes
Routes.Applicant = ApplicantRoutes
Routes.Employer = EmployerRoutes
Routes.Other = OtherRoutes
Routes.Admin = AdminRoutes

module.exports = Routes