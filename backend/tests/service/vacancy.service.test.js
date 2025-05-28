const VacancyService = require('../../services/vacancy.service');
const Repositories = require('../../repositories/repositories');
const AppError = require('../../errors/AppError');

jest.mock('../../repositories/repositories');

describe('VacancyService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getVacancy', () => {
        it('should return vacancy by id', async () => {
            const mockVacancy = { _id: '1', name: 'Developer' };
            Repositories.Vacancy.getOne.mockResolvedValue(mockVacancy);

            const result = await VacancyService.getVacancy('1');
            expect(result).toEqual(mockVacancy);
        });

        it('should throw error if vacancy not found', async () => {
            Repositories.Vacancy.getOne.mockResolvedValue(null);

            await expect(VacancyService.getVacancy('1'))
                .rejects
                .toThrow(new AppError(404, 'Вакансия не найдена'));
        });
    });

    describe('addVacancy', () => {
        it('should add new vacancy for employer with company', async () => {
            const mockEmployer = { company: { company_regnum: '123' } };
            const mockVacancy = { _id: '1', name: 'Developer' };

            Repositories.Employer.getOne.mockResolvedValue(mockEmployer);
            Repositories.Vacancy.add.mockResolvedValue(mockVacancy);

            const result = await VacancyService.addVacancy('user1', { name: 'Developer' });
            expect(result).toEqual(mockVacancy);
        });

        it('should throw error if employer has no company', async () => {
            Repositories.Employer.getOne.mockResolvedValue({});

            await expect(VacancyService.addVacancy('user1', {}))
                .rejects
                .toThrow(new AppError(400, 'Работодатель без компании'));
        });
    });

    describe('editVacancy', () => {
        it('should allow admin to edit any vacancy', async () => {
            const mockVacancy = { _id: '1', name: 'Updated' };

            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.User.getRole.mockResolvedValue('admin');
            Repositories.Vacancy.edit.mockResolvedValue(mockVacancy);

            const result = await VacancyService.editVacancy('admin1', '1', {});
            expect(result).toEqual(mockVacancy);
        });

        it('should allow employer to edit own vacancy', async () => {
            const mockEmployer = { company: { company_regnum: '123' } };
            const mockVacancy = { _id: '1', company: { company_regnum: '123' } };

            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.User.getRole.mockResolvedValue('employer');
            Repositories.Employer.getOne.mockResolvedValue(mockEmployer);
            Repositories.Vacancy.getOne.mockResolvedValue(mockVacancy);
            Repositories.Vacancy.edit.mockResolvedValue(mockVacancy);

            const result = await VacancyService.editVacancy('user1', '1', {});
            expect(result).toEqual(mockVacancy);
        });
    });

    describe('deleteVacancy', () => {
        it('should delete vacancy and responses for admin', async () => {
            const mockVacancy = { _id: '1' };

            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.User.getRole.mockResolvedValue('admin');
            Repositories.Vacancy.delete.mockResolvedValue(mockVacancy);
            Repositories.Response.deleteResponsesByVacancyId.mockResolvedValue({});

            const result = await VacancyService.deleteVacancy('admin1', '1');
            expect(result).toEqual(mockVacancy);
        });

        it('should throw error if employer tries to delete not own vacancy', async () => {
            const mockEmployer = { company: { company_regnum: '123' } };
            const mockVacancy = { _id: '1', company: { company_regnum: '456' } };

            Repositories.Vacancy.isExists.mockResolvedValue(true);
            Repositories.User.getRole.mockResolvedValue('employer');
            Repositories.Employer.getOne.mockResolvedValue(mockEmployer);
            Repositories.Vacancy.getOne.mockResolvedValue(mockVacancy);

            await expect(VacancyService.deleteVacancy('user1', '1'))
                .rejects
                .toThrow(new AppError(400, 'Вакансия не принадлежит компании работодателя'));
        });
    });

    describe('getResponsedVacancies', () => {
        it('should return vacancies user responded to', async () => {
            const mockVacancies = [{ _id: '1' }, { _id: '2' }];

            Repositories.Vacancy.getResponsedVacancies.mockResolvedValue(mockVacancies);

            const result = await VacancyService.getResponsedVacancies('user1');
            expect(result).toEqual(mockVacancies);
        });

        it('should throw error if no vacancies found', async () => {
            Repositories.Vacancy.getResponsedVacancies.mockResolvedValue(null);

            await expect(VacancyService.getResponsedVacancies('user1'))
                .rejects
                .toThrow(new AppError(404, 'Вакансии не найдены'));
        });
    });
});