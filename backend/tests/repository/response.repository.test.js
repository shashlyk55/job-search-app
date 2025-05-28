const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const responseRepository = require('../../repositories/response.repository');
const Models = require('../../models/Models');

describe('responseRepository', () => {
    let mongoServer;
    let testUser;
    let testApplicant;
    let testResume;
    let testVacancy;
    let testResponse;

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
        // Создаем тестовые данные
        testUser = await Models.User.create({
            name: 'Test User',
            password_hash: 'hashed_password',
            contacts: { email: 'test@example.com' },
            role: 'applicant'
        });

        testApplicant = await Models.Applicant.create({
            user: testUser._id
        });

        testResume = await Models.Resume.create({
            applicant_id: testApplicant._id,
            name: 'Test Resume',
            skills: ['JavaScript', 'Node.js']
        });

        testVacancy = await Models.Vacancy.create({
            name: 'Test Vacancy',
            describe: 'Test description',
            company: {
                company_regnum: '123456',
                name: 'Test Company'
            },
            industry_id: new mongoose.Types.ObjectId()
        });

        testResponse = await Models.Response.create({
            applicant_id: testApplicant._id,
            vacancy_id: testVacancy._id,
            resume_id: testResume._id,
            applicant_pinned_message: 'Test message'
        });
    });

    afterEach(async () => {
        await Promise.all([
            Models.User.deleteMany({}),
            Models.Applicant.deleteMany({}),
            Models.Resume.deleteMany({}),
            Models.Vacancy.deleteMany({}),
            Models.Response.deleteMany({})
        ]);
    });

    describe('add', () => {
        it('should create and return a new response', async () => {
            const newResponseData = {
                applicant_id: testApplicant._id,
                vacancy_id: testVacancy._id,
                resume_id: testResume._id,
                employer_pinned_message: 'Hiring manager note'
            };

            const result = await responseRepository.add(newResponseData);

            expect(result.employer_pinned_message).toBe('Hiring manager note');

            // Проверяем сохранение в БД
            const dbResponse = await Models.Response.findById(result._id);
            expect(dbResponse).not.toBeNull();
        });
    });

    describe('getAllForVacancy', () => {
        it('should return all responses for vacancy with populated data', async () => {
            // Создаем второй отклик на ту же вакансию
            const anotherApplicant = await Models.Applicant.create({
                user: (await Models.User.create({
                    name: 'Another User',
                    password_hash: 'hash',
                    role: 'applicant'
                }))._id
            });

            const anotherResume = await Models.Resume.create({
                applicant_id: anotherApplicant._id,
                name: 'Another Resume'
            });

            await Models.Response.create({
                applicant_id: anotherApplicant._id,
                vacancy_id: testVacancy._id,
                resume_id: anotherResume._id
            });

            const result = await responseRepository.getAllForVacancy(testVacancy._id);

            expect(result).toHaveLength(2);
            expect(result[0].resume_id.name).toBe('Test Resume');
            expect(result[0].applicant_id.user.name).toBe('Test User');
            expect(result[1].resume_id.name).toBe('Another Resume');
        });

        it('should return empty array if no responses for vacancy', async () => {
            await Models.Response.deleteMany({});
            const result = await responseRepository.getAllForVacancy(testVacancy._id);
            expect(result).toEqual([]);
        });
    });

    describe('getAllForUser', () => {
        it('should return all responses for user with populated data', async () => {
            // Создаем вторую вакансию и отклик
            const anotherVacancy = await Models.Vacancy.create({
                name: 'Another Vacancy',
                describe: 'Another description',
                company: {
                    company_regnum: '654321',
                    name: 'Another Company'
                },
                industry_id: new mongoose.Types.ObjectId()
            });

            await Models.Response.create({
                applicant_id: testApplicant._id,
                vacancy_id: anotherVacancy._id,
                resume_id: testResume._id
            });

            const result = await responseRepository.getAllForUser(testUser._id);

            expect(result).toHaveLength(2);
            expect(result[0].vacancy_id.name).toBe('Test Vacancy');
            expect(result[1].vacancy_id.name).toBe('Another Vacancy');
            expect(result[0].resume_id.name).toBe('Test Resume');
        });

    });

    describe('getOne', () => {
        it('should return response by id', async () => {
            const result = await responseRepository.getOne(testResponse._id);
            expect(result.applicant_pinned_message).toBe('Test message');
        });

        it('should return null for non-existent id', async () => {
            const result = await responseRepository.getOne(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all responses', async () => {
            // Создаем второй отклик
            await Models.Response.create({
                applicant_id: testApplicant._id,
                vacancy_id: testVacancy._id,
                resume_id: testResume._id
            });

            const result = await responseRepository.getAll();
            expect(result).toHaveLength(2);
        });

        it('should return empty array if no responses', async () => {
            await Models.Response.deleteMany({});
            const result = await responseRepository.getAll();
            expect(result).toEqual([]);
        });
    });

    describe('delete', () => {
        it('should delete and return the response', async () => {
            const result = await responseRepository.delete(testResponse._id);
            expect(result.applicant_pinned_message).toBe('Test message');

            // Проверяем удаление из БД
            const dbResponse = await Models.Response.findById(testResponse._id);
            expect(dbResponse).toBeNull();
        });
    });

    describe('edit', () => {
        it('should update and return edited response', async () => {
            const updates = {
                is_approved: true,
                employer_pinned_message: 'Approved for interview'
            };

            const result = await responseRepository.edit(testResponse._id, updates);

            expect(result.is_approved).toBe(true);
            expect(result.employer_pinned_message).toBe('Approved for interview');

            // Проверяем обновление в БД
            const dbResponse = await Models.Response.findById(testResponse._id);
            expect(dbResponse.is_approved).toBe(true);
        });
    });

    describe('isExists', () => {
        it('should return true for existing response', async () => {
            const result = await responseRepository.isExists(testResponse._id);
            expect(result).toBeTruthy();
        });

        it('should return false for non-existent response', async () => {
            const result = await responseRepository.isExists(new mongoose.Types.ObjectId());
            expect(result).toBeFalsy();
        });
    });

    describe('isApplicantAlreadyRespond', () => {
        it('should return true if applicant already responded', async () => {
            const result = await responseRepository.isApplicantAlreadyRespond(
                testApplicant._id,
                testVacancy._id
            );
            expect(result).toBe(true);
        });

        it('should return false if applicant not responded', async () => {
            const anotherApplicant = await Models.Applicant.create({
                user: (await Models.User.create({
                    name: 'Another User',
                    password_hash: 'hash',
                    role: 'applicant'
                }))._id
            });

            const result = await responseRepository.isApplicantAlreadyRespond(
                anotherApplicant._id,
                testVacancy._id
            );
            expect(result).toBe(false);
        });
    });

    describe('deleteResponsesByVacancyId', () => {
        it('should delete all responses for vacancy', async () => {
            // Создаем второй отклик на ту же вакансию
            await Models.Response.create({
                applicant_id: testApplicant._id,
                vacancy_id: testVacancy._id,
                resume_id: testResume._id
            });

            const result = await responseRepository.deleteResponsesByVacancyId(testVacancy._id);
            expect(result.deletedCount).toBe(2);

            // Проверяем удаление из БД
            const responses = await Models.Response.find({ vacancy_id: testVacancy._id });
            expect(responses).toHaveLength(0);
        });

        it('should return 0 if no responses for vacancy', async () => {
            await Models.Response.deleteMany({});
            const result = await responseRepository.deleteResponsesByVacancyId(testVacancy._id);
            expect(result.deletedCount).toBe(0);
        });
    });
});