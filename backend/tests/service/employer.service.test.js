const EmployerService = require('../../services/employer.service');
const AppError = require('../../errors/AppError');
const Repositories = require('../../repositories/repositories');

jest.mock('../../repositories/repositories');

describe('EmployerService', () => {
    const mockUserId = 'user123';
    const mockCompanyId = 'company456';
    const mockVacancyId = 'vacancy789';
    const mockResponseId = 'response101';

    const mockUser = {
        _id: mockUserId,
        name: 'John Doe',
        contacts: {
            email: 'john@example.com',
            phone: '+1234567890'
        }
    };

    const mockEmployer = {
        _id: 'employer123',
        user: mockUserId,
        company: {
            company_regnum: '1234567890',
            boss_contacts: {
                email: 'boss@example.com',
                phone: ['+1234567890']
            },
            activity: 'IT',
            name: 'Test Company'
        },
        requested_company: null
    };

    const mockEmployerWithUser = {
        ...mockEmployer,
        user: mockUser
    };

    const mockVacancy = {
        _id: mockVacancyId,
        title: 'Test Vacancy',
        company_regnum: '1234567890',
    };

    const mockResponse = {
        _id: mockResponseId,
        vacancy: mockVacancyId,
        applicant: 'applicant123'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getEmployerProfile', () => {
        it('should return employer profile if exists', async () => {
            Repositories.Employer.getProfile.mockResolvedValue(mockEmployer);

            const result = await EmployerService.getEmployerProfile(mockUserId);

            expect(Repositories.Employer.getProfile).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockEmployer);
            expect(result.company.name).toBe('Test Company');
        });

        it('should throw 404 if profile not found', async () => {
            Repositories.Employer.getProfile.mockResolvedValue(null);

            await expect(EmployerService.getEmployerProfile(mockUserId))
                .rejects.toThrow(new AppError(404, 'Профиль не найден'));
        });
    });

    describe('editEmployerProfile', () => {
        it('should edit employer profile', async () => {
            const updatedData = {
                mockUserId,
                name: 'Updated Name',
                contacts: mockEmployerWithUser.user.contacts
            };

            Repositories.Employer.editProfile.mockResolvedValue(updatedData);

            const result = await EmployerService.editEmployerProfile(mockUserId, updatedData.name, updatedData.contacts);
            expect(result.name).toBe(updatedData.name);
        });
    });

    describe('getCompanyVacancies', () => {
        it('should return company vacancies with response counts', async () => {
            Repositories.Employer.getOne.mockResolvedValue(mockEmployer);
            Repositories.Vacancy.getCompanyVacancies.mockResolvedValue([mockVacancy]);
            Repositories.Response.getAllForVacancy.mockResolvedValue([mockResponse]);

            const result = await EmployerService.getCompanyVacancies(mockUserId);

            expect(Repositories.Employer.getOne).toHaveBeenCalledWith(mockUserId);
            expect(Repositories.Vacancy.getCompanyVacancies).toHaveBeenCalledWith('1234567890');
            expect(result[0].responses_count).toBe(1);
        });

        it('should throw 400 if employer has no company', async () => {
            Repositories.Employer.getOne.mockResolvedValue({ ...mockEmployer, company: null });

            await expect(EmployerService.getCompanyVacancies(mockUserId))
                .rejects.toThrow(new AppError(404, 'Работодатель не состоит в компании'));
        });
    });

    describe('joinCompany', () => {
        it('should set requested_company when joining', async () => {
            const companyRegnum = '9876543210';

            Repositories.Employer.editEmployerCompany.mockResolvedValue({
                ...mockEmployer,
                requested_company: companyRegnum
            });

            const result = await EmployerService.joinCompany(mockUserId, companyRegnum);

            expect(Repositories.Employer.editEmployerCompany).toHaveBeenCalledWith(
                mockUserId,
                companyRegnum,
                null
            );
            expect(result.requested_company).toBe(companyRegnum);
        });

        it('should throw 500 if join fails', async () => {
            Repositories.Employer.editEmployerCompany.mockResolvedValue(null);

            await expect(EmployerService.joinCompany(mockUserId, '123'))
                .rejects.toThrow(new AppError(500, 'Ошибка присоединения к компании'));
        });
    });

    describe('leaveCompany', () => {
        it('should clear company data when leaving', async () => {
            Repositories.Employer.editEmployerCompany.mockResolvedValue({
                ...mockEmployer,
                company: null,
                requested_company: null
            });

            const result = await EmployerService.leaveCompany(mockUserId);

            expect(Repositories.Employer.editEmployerCompany).toHaveBeenCalledWith(
                mockUserId,
                null,
                null
            );
            expect(result.company).toBeNull();
            expect(result.requested_company).toBeNull();
        });

        it('should throw 500 if leave fails', async () => {
            Repositories.Employer.editEmployerCompany.mockResolvedValue(null);

            await expect(EmployerService.leaveCompany(mockUserId))
                .rejects.toThrow(new AppError(500, 'Ошибка выхода работодателя из компании'));
        });
    });
});