const ApplicantModel = require('./Applicant')
const ResumeModel = require('./Resume')
const EmployerModel = require('./Employer')
const CompanyModel = require('./Company')
const VacancyModel = require('./Vacancy')
const ResponseModel = require('./Response')
const IndustryTypeModel = require('./IndustryType')
const UserModel = require('./User')
const JoinCompanyRequestModel = require('./JoinCompanyRequest')

const Models = {}
Models.Applicant = ApplicantModel
Models.Resume = ResumeModel
Models.Employer = EmployerModel
Models.Company = CompanyModel
Models.Vacancy = VacancyModel
Models.Response = ResponseModel
Models.IndustryType = IndustryTypeModel
Models.User = UserModel
Models.JoinCompanyRequest = JoinCompanyRequestModel

module.exports = Models
