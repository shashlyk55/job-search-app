const ApplicantRepository = require('./applicant.repository')
const CompanyRepository = require('./company.repository')
const EmployerRepository = require('./employer.repository')
const IndustryTypeRepository = require('./industryType.repository')
const ResponseRepository = require('./response.repository')
const ResumeRepository = require('./resume.repository')
const UserRepository = require('./user.repository')
const VacancyRepository = require('./vacancy.repository')
const JoinCompanyRequestRepository = require('./joinCompanyRequest.repository')

const Repository = {}
Repository.Applicant = ApplicantRepository
Repository.Company = CompanyRepository
Repository.Employer = EmployerRepository
Repository.IndustryType = IndustryTypeRepository
Repository.Response = ResponseRepository
Repository.Resume = ResumeRepository
Repository.User = UserRepository
Repository.Vacancy = VacancyRepository
Repository.JoinCompanyRequest = JoinCompanyRequestRepository

module.exports = Repository