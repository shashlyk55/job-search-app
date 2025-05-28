const services = {}
services.Applicant = require('./applicant.service')
services.Resume = require('./resume.service')
services.Vacancy = require('./vacancy.service')
services.Response = require('./response.service')
services.IndustryType = require('./industryType.service')
services.Employer = require('./employer.service')
services.Company = require('./company.service')
services.User = require('./user.service')
services.JoinCompanyrequest = require('./joinCompanyRequest.service')

module.exports = services