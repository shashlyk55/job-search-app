const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const IndustryTypeRepository = require('../../repositories/industryType.repository');
const Models = require('../../models/Models');

describe('IndustryTypeRepository', () => {
    let mongoServer;
    let testIndustry;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Создаем тестовую индустрию
        testIndustry = await Models.IndustryType.create({
            industry_type: 'IT'
        });
    });

    afterEach(async () => {
        await Models.IndustryType.deleteMany({});
    });

    // 1. Тест для getAll
    it('should return all industries', async () => {
        await Models.IndustryType.create({ industry_type: 'Finance' });
        const result = await IndustryTypeRepository.getAll();
        expect(result).toHaveLength(2);
        expect(result[0].industry_type).toBe('IT');
        expect(result[1].industry_type).toBe('Finance');
    });

    // 2. Тест для getOne
    it('should return industry by id', async () => {
        const result = await IndustryTypeRepository.getOne(testIndustry._id);
        expect(result.industry_type).toBe('IT');
    });

    // 3. Тест для edit
    it('should update and return edited industry', async () => {
        const result = await IndustryTypeRepository.edit(testIndustry._id, { industry_type: 'Technology' });
        expect(result.industry_type).toBe('Technology');
    });

    // 4. Тест для delete
    it('should delete and return the industry', async () => {
        const result = await IndustryTypeRepository.delete(testIndustry._id);
        expect(result.industry_type).toBe('IT');
        const industries = await Models.IndustryType.find();
        expect(industries).toHaveLength(0);
    });

    // 5. Тест для add
    it('should create and return new industry', async () => {
        const result = await IndustryTypeRepository.add('Healthcare');
        expect(result.industry_type).toBe('Healthcare');
        const industries = await Models.IndustryType.find();
        expect(industries).toHaveLength(2);
    });

});