const Repositories = require('../repositories/repositories')
const AppError = require('../errors/AppError')

const JoinCompanyRequestService = {
    getAll: async (userId) => {
        if ((await Repositories.User.getRole(userId)) != 'admin') {
            throw new AppError(400, 'Пользователь не является админом')
        }
        const requests = await Repositories.JoinCompanyRequest.getAll()
        return requests
    },
    approveRequest: async (requestId) => {
        const request = await Repositories.JoinCompanyRequest.getById(requestId)
        const company_regnum = request.company_regnum
        const company = {}

        try {
            const [company_contacts_response, company_activity_response, company_name_response] = await Promise.all([
                fetch(`http://egr.gov.by/api/v2/egr/getAddressByRegNum/${company_regnum}`),
                fetch(`http://egr.gov.by/api/v2/egr/getVEDByRegNum/${company_regnum}`),
                fetch(`http://egr.gov.by/api/v2/egr/getShortInfoByRegNum/${company_regnum}`)
            ]);

            if (!company_contacts_response.ok || !company_activity_response.ok || !company_name_response.ok) {
                throw new AppError(400, 'Неверный УНП компании');
            }

            const company_contacts = await company_contacts_response.json();
            const company_activity = await company_activity_response.json();
            const company_name = await company_name_response.json();

            company.boss_contacts = {
                email: company_contacts[0].vemail,
                phone: company_contacts[0].vtels.split(',').map(el => el.trim())
            }
            company.activity = company_activity[0].nsi00114.vnvdnp
            company.name = company_name[0].vfn
            company.company_regnum = company_regnum
        } catch (error) {
            throw new AppError(500, 'Ошибка получения данных о компании');
        }
        const employer = await Repositories.Employer.getByEmployerId(request.employer)
        const editedEmployer = await Repositories.Employer.editEmployerCompany(employer.user, company, null)
        const deletedJoinCompanyRequest = await Repositories.JoinCompanyRequest.delete(request.id)

        return company
    },
    rejectRequest: async (requestId) => {
        const request = await Repositories.JoinCompanyRequest.getById(requestId)
        const employer = await Repositories.Employer.getByEmployerId(request.employer)
        const deletedRequest = await Repositories.JoinCompanyRequest.delete(requestId)
        const editedEmployer = await Repositories.Employer.editEmployerCompany(employer.user, null, null)
        return editedEmployer
    },
    sendRequest: async (userId, request) => {
        if (await Repositories.User.getRole(userId) != 'employer') {
            throw new AppError(400, 'Пользователь не является работодателем')
        }
        const employer = await Repositories.Employer.getProfile(userId)

        if ((await Repositories.JoinCompanyRequest.findDuplicate(employer.id, request.company_regnum)).length != 0) {
            throw new AppError(400, 'Такой запрос уже отправлен')
        }
        request.employer = employer.id

        const company_regnum = request.company_regnum

        const company = {}

        // try {
        //     var url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
        //     var token = "20f11e317545cdfabfc63ec430de1206eff3ddc5";
        //     var query = "7707083893";

        //     var options = {
        //         method: "POST",
        //         mode: "cors",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Accept": "application/json",
        //             "Authorization": "Token " + process.env.API_KEY
        //         },
        //         body: JSON.stringify({ query: company_regnum, count: 1 })
        //     }

        //     const response = await fetch(url, options)
        //     const result = await response.json()
        //     console.log(result.suggestions[0].data.name.full);

        //     company.name = result.suggestions[0].data.name.full
        //     company.activity = result.suggestions[0].okveds[1].name | ""
        //     company.company_regnum = company_regnum
        //     company.boss_contacts = {
        //         email: result.emails[0].value | "",
        //         phone: result.phones.map((p) => p.value | "")
        //     }
        // } catch (error) {
        //     console.error('Произошла ошибка:', error.message);
        //     throw error;
        // }
        // console.log(company);


        try {
            const [company_contacts_response, company_activity_response, company_name_response] = await Promise.all([
                fetch(`http://egr.gov.by/api/v2/egr/getAddressByRegNum/${company_regnum}`),
                fetch(`http://egr.gov.by/api/v2/egr/getVEDByRegNum/${company_regnum}`),
                fetch(`http://egr.gov.by/api/v2/egr/getShortInfoByRegNum/${company_regnum}`)
            ]);

            if (company_contacts_response.status == 400 || company_activity_response.status == 400 || company_name_response.status == 400) {
                throw new AppError(400, 'Неверный УНП компании');
            }

            const company_contacts = await company_contacts_response.json();
            const company_activity = await company_activity_response.json();
            const company_name = await company_name_response.json();

            company.boss_contacts = {
                email: company_contacts[0].vemail,
                phone: company_contacts[0].vtels.split(',').map(el => el.trim())
            }
            company.activity = company_activity[0].nsi00114.vnvdnp
            company.name = company_name[0].vfn
            company.company_regnum = company_regnum
        } catch (error) {
            console.error('Произошла ошибка:', error.message);
            throw error;
        }
        request.company = company

        const sendedRequest = await Repositories.JoinCompanyRequest.add(request)
        if (!sendedRequest) {
            throw new AppError(500, 'Запрос не отправлен')
        }
        const updatedEmployer = await Repositories.Employer.editEmployerCompany(userId, null, request.company_regnum)
        return updatedEmployer
    },
    cancelRequest: async (userId) => {
        const employer = await Repositories.Employer.getOne(userId)
        const request = await Repositories.JoinCompanyRequest.getByEmployerId(employer.id)

        if (!request) {
            throw new AppError(404, 'Запрос не найден')
        }
        const deletedRequest = await Repositories.JoinCompanyRequest.delete(request.id)
        if (!deletedRequest) {
            throw new AppError(500, 'Запрос не отменен')
        }
        const updatedEmployer = await Repositories.Employer.editEmployerCompany(userId, null, null)
        return updatedEmployer
    },
}

module.exports = JoinCompanyRequestService