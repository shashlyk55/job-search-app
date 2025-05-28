const JoinCompanyRequestService = require('../../services/joinCompanyRequest.service');
const Repositories = require('../../repositories/repositories');
const AppError = require('../../errors/AppError');
const fetch = require('node-fetch');

jest.mock('../../repositories/repositories');
jest.mock('node-fetch', () => jest.fn()); // Мокаем fetch

describe('JoinCompanyRequestService', () => {
    const mockUserId = 'user123';
    const mockEmployerId = 'employer456';
    const mockRequestId = 'request789';
    const mockCompanyRegnum = '391831608';

    const mockEmployer = {
        id: mockEmployerId,
        user: mockUserId
    };

    const mockRequest = {
        id: mockRequestId,
        employer: mockEmployerId,
        company_regnum: mockCompanyRegnum
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Настраиваем моки для успешных API-запросов
        fetch.mockImplementation((url) => {
            if (url.includes('getAddressByRegNum')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ vemail: 'test@example.com', vtels: '+1234567890' }])
                });
            }
            if (url.includes('getVEDByRegNum')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ nsi00114: { vnvdnp: 'IT Services' } }])
                });
            }
            if (url.includes('getShortInfoByRegNum')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ vfn: 'Test Company' }])
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    describe('getAll', () => {
        it('should return all requests for admin', async () => {
            Repositories.User.getRole.mockResolvedValue('admin');
            Repositories.JoinCompanyRequest.getAll.mockResolvedValue([mockRequest]);

            const result = await JoinCompanyRequestService.getAll(mockUserId);

            expect(result).toEqual([mockRequest]);
        });
    });

    // Остальные тесты остаются аналогичными, но с использованием CommonJS
    describe('approveRequest', () => {
        it('should approve request successfully', async () => {
            Repositories.JoinCompanyRequest.getById.mockResolvedValue(mockRequest);
            Repositories.Employer.getByEmployerId.mockResolvedValue(mockEmployer);
            Repositories.Employer.editEmployerCompany.mockResolvedValue({});
            Repositories.JoinCompanyRequest.delete.mockResolvedValue(true);

            const result = await JoinCompanyRequestService.approveRequest(mockRequestId);

            expect(result).not.toBeNull()
        });
    });

    describe('rejectRequest', () => {
        it('should reject request and clear company data', async () => {
            Repositories.JoinCompanyRequest.getById.mockResolvedValue(mockRequest);
            Repositories.Employer.getByEmployerId.mockResolvedValue(mockEmployer);
            Repositories.JoinCompanyRequest.delete.mockResolvedValue(true);
            Repositories.Employer.editEmployerCompany.mockResolvedValue({});

            const result = await JoinCompanyRequestService.rejectRequest(mockRequestId);

            expect(Repositories.JoinCompanyRequest.delete).toHaveBeenCalledWith(mockRequestId);
            expect(Repositories.Employer.editEmployerCompany).toHaveBeenCalledWith(
                mockUserId, null, null
            );
            expect(result).toEqual({});
        });
    });

    describe('sendRequest', () => {
        it('should send new join request', async () => {
            const requestData = { company_regnum: mockCompanyRegnum };

            Repositories.User.getRole.mockResolvedValue('employer');
            Repositories.Employer.getProfile.mockResolvedValue(mockEmployer);
            Repositories.JoinCompanyRequest.findDuplicate.mockResolvedValue([]);
            Repositories.JoinCompanyRequest.add.mockResolvedValue(mockRequest);
            Repositories.Employer.editEmployerCompany.mockResolvedValue({});

            const result = await JoinCompanyRequestService.sendRequest(mockUserId, requestData);

            expect(Repositories.JoinCompanyRequest.add).toHaveBeenCalledWith(
                expect.objectContaining({
                    employer: mockEmployerId,
                    company_regnum: mockCompanyRegnum,
                    company: expect.anything()
                })
            );
            expect(result).not.toBeNull()
        });

        it('should throw error for duplicate request', async () => {
            Repositories.User.getRole.mockResolvedValue('employer');
            Repositories.Employer.getProfile.mockResolvedValue(mockEmployer);
            Repositories.JoinCompanyRequest.findDuplicate.mockResolvedValue([mockRequest]);

            await expect(JoinCompanyRequestService.sendRequest(mockUserId, { company_regnum: mockCompanyRegnum }))
                .rejects.toThrow(new AppError(400, 'Такой запрос уже отправлен'));
        });
    });

    describe('cancelRequest', () => {
        it('should cancel existing request', async () => {
            Repositories.Employer.getOne.mockResolvedValue(mockEmployer);
            Repositories.JoinCompanyRequest.getByEmployerId.mockResolvedValue(mockRequest);
            Repositories.JoinCompanyRequest.delete.mockResolvedValue(true);
            Repositories.Employer.editEmployerCompany.mockResolvedValue({});

            const result = await JoinCompanyRequestService.cancelRequest(mockUserId);

            expect(Repositories.JoinCompanyRequest.delete).toHaveBeenCalledWith(mockRequestId);
            expect(result).toEqual({});
        });

        it('should throw error if request not found', async () => {
            Repositories.Employer.getOne.mockResolvedValue(mockEmployer);
            Repositories.JoinCompanyRequest.getByEmployerId.mockResolvedValue(null);

            await expect(JoinCompanyRequestService.cancelRequest(mockUserId))
                .rejects.toThrow(new AppError(404, 'Запрос не найден'));
        });
    });
});