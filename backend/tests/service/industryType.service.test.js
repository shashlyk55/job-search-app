const IndustryTypeService = require('../../services/industryType.service');
const Repositories = require('../../repositories/repositories');
const AppError = require('../../errors/AppError');

jest.mock('../../repositories/repositories');

describe('IndustryTypeService', () => {
    let mongoServer;
    const mockIndustryId = '1234567890ab';
    const mockIndustryName = 'IT';
    const mockIndustry = {
        _id: mockIndustryId,
        industry_type: mockIndustryName
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addIndustryType', () => {
        it('should successfully add new industry type', async () => {
            // Настраиваем моки
            Repositories.IndustryType.isExists.mockResolvedValue(false);
            Repositories.IndustryType.add.mockResolvedValue(mockIndustry);

            // Вызываем тестируемый метод
            const result = await IndustryTypeService.addIndustryType(mockIndustryName);

            // Проверяем вызовы
            expect(Repositories.IndustryType.isExists).toHaveBeenCalledWith(mockIndustryName);
            expect(Repositories.IndustryType.add).toHaveBeenCalledWith(mockIndustryName);

            // Проверяем результат
            expect(result).toEqual(mockIndustry);
        });

        it('should throw error when industry already exists', async () => {
            Repositories.IndustryType.isExists.mockResolvedValue(true);

            await expect(IndustryTypeService.addIndustryType(mockIndustryName))
                .rejects.toThrow(new AppError(404, 'Отрасль уже существует'));
        });
    });

    describe('deleteIndustryType', () => {
        it('should successfully delete existing industry', async () => {
            // Настраиваем моки
            Repositories.IndustryType.getOne.mockResolvedValue(mockIndustry);
            Repositories.IndustryType.isExists.mockResolvedValue(true);
            Repositories.IndustryType.delete.mockResolvedValue(mockIndustry);

            // Вызываем тестируемый метод
            const result = await IndustryTypeService.deleteIndustryType(mockIndustryId);

            // Проверяем вызовы
            expect(Repositories.IndustryType.getOne).toHaveBeenCalledWith(mockIndustryId);
            expect(Repositories.IndustryType.isExists).toHaveBeenCalledWith(mockIndustryName);
            expect(Repositories.IndustryType.delete).toHaveBeenCalledWith(mockIndustryId);

            // Проверяем результат
            expect(result).toEqual(mockIndustry);
        });

        it('should throw error when industry not found', async () => {
            Repositories.IndustryType.getOne.mockResolvedValue(mockIndustry);
            Repositories.IndustryType.isExists.mockResolvedValue(false);

            await expect(IndustryTypeService.deleteIndustryType(mockIndustryId))
                .rejects.toThrow(new AppError(404, 'Отрасль не найдена'));
        });
    });

    describe('editIndustryType', () => {
        it('should successfully edit industry type', async () => {
            const updatedName = 'Updated IT';

            // Настраиваем моки
            Repositories.IndustryType.isExists.mockResolvedValue(true);
            Repositories.IndustryType.edit.mockResolvedValue({
                ...mockIndustry,
                industry_type: updatedName
            });

            // Вызываем тестируемый метод
            const result = await IndustryTypeService.editIndustryType(mockIndustryId, updatedName);

            // Проверяем вызовы
            expect(Repositories.IndustryType.isExists).toHaveBeenCalledWith(mockIndustryId);
            expect(Repositories.IndustryType.edit).toHaveBeenCalledWith(mockIndustryId, updatedName);

            // Проверяем результат
            expect(result.industry_type).toBe(updatedName);
        });

        it('should throw error when industry not found', async () => {
            Repositories.IndustryType.isExists.mockResolvedValue(false);

            await expect(IndustryTypeService.editIndustryType(mockIndustryId, 'New Name'))
                .rejects.toThrow(new AppError(404, 'Отрасль не найдена'));
        });
    });

    describe('getAllIndustryTypes', () => {
        it('should return array of industries', async () => {
            const mockIndustries = [
                mockIndustry,
                { _id: '0987654321ab', industry_type: 'Finance' }
            ];

            // Настраиваем моки
            Repositories.IndustryType.getAll.mockResolvedValue(mockIndustries);

            // Вызываем тестируемый метод
            const result = await IndustryTypeService.getAllIndustryTypes();

            // Проверяем вызовы
            expect(Repositories.IndustryType.getAll).toHaveBeenCalled();

            // Проверяем результат
            expect(result).toEqual(mockIndustries);
        });

        it('should return empty array when no industries', async () => {
            // Настраиваем моки
            Repositories.IndustryType.getAll.mockResolvedValue(null);

            // Вызываем тестируемый метод
            const result = await IndustryTypeService.getAllIndustryTypes();

            // Проверяем результат
            expect(result).toEqual([]);
        });
    });
});