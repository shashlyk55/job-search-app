const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const vacancyRepository = require('../../repositories/vacancy.repository');
const Models = require('../../models/Models');

describe('vacancyRepository', () => {
    let mongoServer;
    let testIndustry;
    let testVacancy;

    beforeAll(async () => {
        // Запускаем MongoDB в памяти
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Создаем тестовые данные перед каждым тестом
        testIndustry = await Models.IndustryType.create({ industry_type: 'IT' });

        testVacancy = await Models.Vacancy.create({
            name: 'Senior JavaScript Developer',
            describe: 'We need experienced JS developer',
            salary_amount: 5000,
            currency: 'USD',
            required_experience: 3,
            company: {
                company_regnum: '123456789',
                name: 'Tech Innovations Inc',
                activity: 'Software Development'
            },
            industry_id: testIndustry._id
        });
    });

    afterEach(async () => {
        // Очищаем коллекции после каждого теста
        await Promise.all([
            Models.Vacancy.deleteMany({}),
            Models.IndustryType.deleteMany({}),
            Models.Response.deleteMany({})
        ]);
    });

    describe('add', () => {
        it('should create and return a new vacancy with populated industry', async () => {
            const newVacancyData = {
                name: 'Junior Frontend Developer',
                describe: 'Entry level frontend position',
                salary_amount: 2000,
                currency: 'USD',
                company: {
                    company_regnum: '987654321',
                    name: 'Web Solutions',
                    activity: 'Web Development'
                },
                industry_id: testIndustry._id
            };

            const result = await vacancyRepository.add(newVacancyData);

            expect(result.name).toBe('Junior Frontend Developer');
            expect(result.salary_amount).toBe(2000);
            expect(result.industry_id.industry_type).toBe('IT');

            // Проверяем сохранение в БД
            const dbVacancy = await Models.Vacancy.findById(result._id);
            expect(dbVacancy).not.toBeNull();
        });

        it('should create vacancy without salary when no currency provided', async () => {
            const newVacancyData = {
                name: 'Intern',
                describe: 'Internship position',
                company: {
                    company_regnum: '987654321',
                    name: 'Web Solutions'
                },
                industry_id: testIndustry._id
            };

            const result = await vacancyRepository.add(newVacancyData);
            expect(result.salary_amount).toBeNull();
            expect(result.currency).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('should return all vacancies with populated industry', async () => {
            const result = await vacancyRepository.getAll();

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Senior JavaScript Developer');
            expect(result[0].industry_id.industry_type).toBe('IT');
        });

        it('should return empty array when no vacancies', async () => {
            await Models.Vacancy.deleteMany({});
            const result = await vacancyRepository.getAll();
            expect(result).toEqual([]);
        });
    });




    describe('getOne', () => {
        it('should return vacancy by id with populated industry', async () => {
            const result = await vacancyRepository.getOne(testVacancy._id);

            expect(result.name).toBe('Senior JavaScript Developer');
            expect(result.industry_id.industry_type).toBe('IT');
        });

        it('should return null for non-existent id', async () => {
            const result = await vacancyRepository.getOne(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('edit', () => {
        it('should update and return edited vacancy', async () => {
            const updates = {
                name: 'Senior Fullstack Developer',
                salary_amount: 5500
            };

            const result = await vacancyRepository.edit(testVacancy._id, updates);

            expect(result.name).toBe('Senior Fullstack Developer');
            expect(result.salary_amount).toBe(5500);

            // Проверяем обновление в БД
            const dbVacancy = await Models.Vacancy.findById(testVacancy._id);
            expect(dbVacancy.name).toBe('Senior Fullstack Developer');
        });
    });

    describe('delete', () => {
        it('should delete and return the vacancy', async () => {
            const result = await vacancyRepository.delete(testVacancy._id);

            expect(result.name).toBe('Senior JavaScript Developer');

            // Проверяем удаление из БД
            const dbVacancy = await Models.Vacancy.findById(testVacancy._id);
            expect(dbVacancy).toBeNull();
        });
    });

    describe('isExists', () => {
        it('should return true for existing vacancy', async () => {
            const result = await vacancyRepository.isExists(testVacancy._id);
            expect(result).toBeTruthy();
        });

        it('should return false for non-existent vacancy', async () => {
            const result = await vacancyRepository.isExists(new mongoose.Types.ObjectId());
            expect(result).toBeFalsy();
        });
    });

    describe('getCompanyVacancies', () => {
        it('should return vacancies for specified company', async () => {
            // Создаем тестовую вакансию другой компании
            await Models.Vacancy.create({
                name: 'Backend Developer',
                describe: 'Node.js position',
                company: {
                    company_regnum: '999888777',
                    name: 'Another Company'
                },
                industry_id: testIndustry._id
            });

            const result = await vacancyRepository.getCompanyVacancies('123456789');

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Senior JavaScript Developer');
            expect(result[0].company.company_regnum).toBe('123456789');
        });

        it('should return empty array for company with no vacancies', async () => {
            const result = await vacancyRepository.getCompanyVacancies('000000000');
            expect(result).toEqual([]);
        });
    });

    describe('getResponsedVacancies', () => {
        let testUser;
        let testApplicant;
        let testResume;

        beforeEach(async () => {
            // Создаем цепочку зависимых документов
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
                name: 'John Doe Resume',
                skills: ['JavaScript', 'Node.js'],
                work_experience: [{
                    company: 'Previous Company',
                    position: 'Developer'
                }]
            });

            // Связываем резюме с аппликантом
            testApplicant.resumes.push(testResume._id);
            await testApplicant.save();
        });

        it('should return vacancies where user responded with populated data', async () => {
            // Создаем отклик
            await Models.Response.create({
                applicant_id: testApplicant._id,
                vacancy_id: testVacancy._id,
                resume_id: testResume._id,
                applicant_pinned_message: 'I want this job!'
            });

            const result = await vacancyRepository.getResponsedVacancies(testUser._id);

            expect(result).toHaveLength(1);
            expect(result[0].vacancy_id.name).toBe('Senior JavaScript Developer');
            expect(result[0].resume_id.name).toBe('John Doe Resume');
            expect(result[0].applicant_pinned_message).toBe('I want this job!');
        });

        it('should return empty array when no responses', async () => {
            const result = await vacancyRepository.getResponsedVacancies(testUser._id);
            expect(result).toEqual([]);
        });

        it('should handle multiple responses correctly', async () => {
            // Создаем вторую вакансию
            const anotherVacancy = await Models.Vacancy.create({
                name: 'Frontend Developer',
                describe: 'React position',
                company: {
                    company_regnum: '123456789',
                    name: 'Tech Innovations Inc'
                },
                industry_id: testIndustry._id
            });

            // Создаем два отклика
            await Promise.all([
                Models.Response.create({
                    applicant_id: testApplicant._id,
                    vacancy_id: testVacancy._id,
                    resume_id: testResume._id
                }),
                Models.Response.create({
                    applicant_id: testApplicant._id,
                    vacancy_id: anotherVacancy._id,
                    resume_id: testResume._id
                })
            ]);

            const result = await vacancyRepository.getResponsedVacancies(testUser._id);
            expect(result).toHaveLength(2);
        });
    });
});