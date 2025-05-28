const ResponseService = require('../../services/response.service');
const Repositories = require('../../repositories/repositories');
const AppError = require('../../errors/AppError');

jest.mock('../../repositories/repositories');

describe('ResponseService', () => {
    const mockUserId = 'user123';
    const mockApplicantId = 'applicant456';
    const mockVacancyId = 'vacancy789';
    const mockResponseId = 'response101';

    const mockResponse = {
        _id: mockResponseId,
        vacancy_id: mockVacancyId,
        applicant_id: mockApplicantId,
        is_approved: null,
        employer_pinned_message: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getResponse', () => {
        it('should return response if exists', async () => {
            Repositories.Response.getOne.mockResolvedValue(mockResponse);

            const result = await ResponseService.getResponse(mockResponseId);

            expect(Repositories.Response.getOne).toHaveBeenCalledWith(mockResponseId);
            expect(result).toEqual(mockResponse);
        });

        it('should throw 404 if response not found', async () => {
            Repositories.Response.getOne.mockResolvedValue(null);

            await expect(ResponseService.getResponse(mockResponseId))
                .rejects.toThrow(new AppError(404, 'Отклик не найден'));
        });
    });

    describe('getAllResponses', () => {
        it('should return all responses', async () => {
            const mockResponses = [mockResponse, {
                _id: 'response202',
                vacancy_id: 'vacancy303'
            }];

            Repositories.Response.getAll.mockResolvedValue(mockResponses);

            const result = await ResponseService.getAllResponses();

            expect(Repositories.Response.getAll).toHaveBeenCalled();
            expect(result).toEqual(mockResponses);
        });

        it('should throw 404 if no responses found', async () => {
            Repositories.Response.getAll.mockResolvedValue(null);

            await expect(ResponseService.getAllResponses())
                .rejects.toThrow(new AppError(404, 'Отклики не найдены'));
        });
    });

    describe('doResponse', () => {
        it('should create new response', async () => {
            const responseData = {
                vacancy_id: mockVacancyId,
                message: 'Test response'
            };

            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicantId);
            Repositories.Response.isApplicantAlreadyRespond.mockResolvedValue(false);
            Repositories.Response.add.mockResolvedValue(mockResponse);

            const result = await ResponseService.doResponse(mockUserId, responseData);

            expect(Repositories.Vacancy.isExists).toHaveBeenCalledWith(mockVacancyId);
            expect(Repositories.Applicant.getByUserId).toHaveBeenCalledWith(mockUserId);
            expect(Repositories.Response.isApplicantAlreadyRespond)
                .toHaveBeenCalledWith(mockApplicantId, mockVacancyId);
            expect(Repositories.Response.add).toHaveBeenCalledWith({
                ...responseData,
                applicant_id: mockApplicantId,
                employer_pinned_message: null,
                is_approved: null
            });
            expect(result).toEqual(mockResponse);
        });

        it('should throw 404 if vacancy not found', async () => {
            Repositories.Vacancy.isExists.mockResolvedValue(false);

            await expect(ResponseService.doResponse(mockUserId, { vacancy_id: mockVacancyId }))
                .rejects.toThrow(new AppError(404, 'Вакансия не найдена'));
        });

        it('should throw 400 if already responded', async () => {
            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicantId);
            Repositories.Response.isApplicantAlreadyRespond.mockResolvedValue(true);

            await expect(ResponseService.doResponse(mockUserId, { vacancy_id: mockVacancyId }))
                .rejects.toThrow(new AppError(400, 'Пользователь уже дал отклик на эту вакансию'));
        });
    });

    describe('cancelResponse', () => {
        it('should cancel response', async () => {
            Repositories.Response.isExists.mockResolvedValue(true);
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicantId);
            Repositories.Response.getOne.mockResolvedValue(mockResponse);
            Repositories.Response.isApplicantAlreadyRespond.mockResolvedValue(true);
            Repositories.Response.delete.mockResolvedValue({ id: mockResponseId });

            const result = await ResponseService.cancelResponse(mockUserId, mockResponseId);

            expect(Repositories.Response.isExists).toHaveBeenCalledWith(mockResponseId);
            expect(Repositories.Applicant.getByUserId).toHaveBeenCalledWith(mockUserId);
            expect(Repositories.Response.isApplicantAlreadyRespond)
                .toHaveBeenCalledWith(mockApplicantId, mockVacancyId);
            expect(Repositories.Response.delete).toHaveBeenCalledWith(mockResponseId);
            expect(result).toBe(mockResponseId);
        });

        it('should throw 404 if response not found', async () => {
            Repositories.Response.isExists.mockResolvedValue(false);

            await expect(ResponseService.cancelResponse(mockUserId, mockResponseId))
                .rejects.toThrow(new AppError(404, 'Отклик не найден'));
        });

        it('should throw 400 if no response from user', async () => {
            Repositories.Response.isExists.mockResolvedValue(true);
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicantId);
            Repositories.Response.getOne.mockResolvedValue(mockResponse);
            Repositories.Response.isApplicantAlreadyRespond.mockResolvedValue(false);

            await expect(ResponseService.cancelResponse(mockUserId, mockResponseId))
                .rejects.toThrow(new AppError(400, 'Пользователь не давал отклик на эту вакансию'));
        });
    });

    describe('getResponsesForVacancy', () => {
        it('should return responses for vacancy', async () => {
            const mockResponses = [mockResponse];

            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.Response.getAllForVacancy.mockResolvedValue(mockResponses);

            const result = await ResponseService.getResponsesForVacancy(mockUserId, mockVacancyId);

            expect(Repositories.Vacancy.isExists).toHaveBeenCalledWith(mockVacancyId);
            expect(Repositories.Response.getAllForVacancy).toHaveBeenCalledWith(mockVacancyId);
            expect(result).toEqual(mockResponses);
        });

        it('should throw 404 if vacancy not found', async () => {
            Repositories.Vacancy.isExists.mockResolvedValue(false);

            await expect(ResponseService.getResponsesForVacancy(mockUserId, mockVacancyId))
                .rejects.toThrow(new AppError(404, 'Вакансия не найдена'));
        });
    });

    describe('approveResponse/rejectResponse', () => {
        const testCases = [
            {
                method: 'approveResponse',
                expectedStatus: true,
                expectedMessage: 'одобрен'
            },
            {
                method: 'rejectResponse',
                expectedStatus: false,
                expectedMessage: 'отклонен'
            }
        ];

        testCases.forEach(({ method, expectedStatus, expectedMessage }) => {
            describe(method, () => {
                it(`should ${expectedMessage} response`, async () => {
                    const pinnedMessage = 'Test message';
                    const updatedResponse = {
                        ...mockResponse,
                        is_approved: expectedStatus,
                        employer_pinned_message: pinnedMessage
                    };

                    Repositories.Response.getOne.mockResolvedValue(mockResponse);
                    Repositories.Response.edit.mockResolvedValue(updatedResponse);

                    const result = await ResponseService[method](mockUserId, mockResponseId, pinnedMessage);

                    expect(Repositories.Response.getOne).toHaveBeenCalledWith(mockResponseId);
                    expect(Repositories.Response.edit).toHaveBeenCalledWith(mockResponseId, {
                        ...mockResponse,
                        is_approved: expectedStatus,
                        employer_pinned_message: pinnedMessage
                    });
                    expect(result).toEqual(updatedResponse);
                });

                it('should throw 404 if response not found', async () => {
                    Repositories.Response.getOne.mockResolvedValue(null);

                    await expect(ResponseService[method](mockUserId, mockResponseId, 'message'))
                        .rejects.toThrow(new AppError(404, 'Отклик не найден'));
                });
            });
        });
    });
});