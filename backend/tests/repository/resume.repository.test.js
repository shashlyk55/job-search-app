const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const resumeRepository = require('../../repositories/resume.repository');
const Models = require('../../models/Models');

describe('resumeRepository', () => {
    let mongoServer;
    let testUser;
    let testApplicant;
    let testResume;

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
            name: 'John Doe Resume',
            biography: 'Experienced developer',
            skills: ['JavaScript', 'Node.js'],
            work_experience: [{
                company: 'Previous Company',
                position: 'Developer',
                years_of_work: 3
            }]
        });
    });

    afterEach(async () => {
        await Promise.all([
            Models.User.deleteMany({}),
            Models.Applicant.deleteMany({}),
            Models.Resume.deleteMany({})
        ]);
    });

    describe('addResume', () => {
        it('should create and return a new resume', async () => {
            const newResumeData = {
                applicant_id: testApplicant._id,
                name: 'New Resume',
                skills: ['React', 'TypeScript']
            };

            const result = await resumeRepository.addResume(newResumeData);

            expect(result.name).toBe('New Resume');
            expect(result.skills).toEqual(['React', 'TypeScript']);

            // Проверяем сохранение в БД
            const dbResume = await Models.Resume.findById(result._id);
            expect(dbResume).not.toBeNull();
        });
    });

    describe('getApplicantResumes', () => {
        it('should return all resumes for applicant', async () => {
            // Создаем второе резюме для того же аппликанта
            await Models.Resume.create({
                applicant_id: testApplicant._id,
                name: 'Second Resume'
            });

            const result = await resumeRepository.getApplicantResumes(testApplicant._id);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('John Doe Resume');
            expect(result[1].name).toBe('Second Resume');
        });

        it('should return empty array if no resumes', async () => {
            await Models.Resume.deleteMany({});
            const result = await resumeRepository.getApplicantResumes(testApplicant._id);
            expect(result).toEqual([]);
        });
    });

    describe('getOne', () => {
        it('should return resume by id', async () => {
            const result = await resumeRepository.getOne(testResume._id);

            expect(result.name).toBe('John Doe Resume');
            expect(result.biography).toBe('Experienced developer');
        });

        it('should return null for non-existent id', async () => {
            const result = await resumeRepository.getOne(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('editResume', () => {
        it('should update and return edited resume', async () => {
            const updates = {
                name: 'Updated Resume Name',
                biography: 'Updated bio'
            };

            const result = await resumeRepository.editResume(testResume._id, updates);

            expect(result.name).toBe('Updated Resume Name');
            expect(result.biography).toBe('Updated bio');

            // Проверяем обновление в БД
            const dbResume = await Models.Resume.findById(testResume._id);
            expect(dbResume.name).toBe('Updated Resume Name');
        });
    });

    describe('deleteResume', () => {
        it('should delete and return the resume', async () => {
            const result = await resumeRepository.deleteResume(testResume._id);

            expect(result.name).toBe('John Doe Resume');

            // Проверяем удаление из БД
            const dbResume = await Models.Resume.findById(testResume._id);
            expect(dbResume).toBeNull();
        });
    });


    describe('isResumeExists', () => {
        it('should return true for existing resume', async () => {
            const result = await resumeRepository.isResumeExists(testResume._id);
            expect(result).toBeTruthy();
        });

        it('should return false for non-existent resume', async () => {
            const result = await resumeRepository.isResumeExists(new mongoose.Types.ObjectId());
            expect(result).toBeFalsy();
        });
    });

    describe('checkResumeOwner', () => {
        it('should return true if applicant owns the resume', async () => {
            const result = await resumeRepository.checkResumeOwner(testUser._id, testResume._id);
            expect(result).toBe(true);
        });

        it('should return false if applicant does not own the resume', async () => {
            // Создаем другого пользователя и аппликанта
            const anotherUser = await Models.User.create({
                name: 'Another User',
                password_hash: 'hash',
                role: 'applicant'
            });
            const anotherApplicant = await Models.Applicant.create({
                user: anotherUser._id
            });

            const result = await resumeRepository.checkResumeOwner(anotherUser._id, testResume._id);
            expect(result).toBe(false);
        });

        it('should return false for non-existent resume', async () => {
            const result = await resumeRepository.checkResumeOwner(
                testUser._id,
                new mongoose.Types.ObjectId()
            );
            expect(result).toBe(false);
        });

        it('should return false if user is not an applicant', async () => {
            // Создаем пользователя без связанного аппликанта
            const nonApplicantUser = await Models.User.create({
                name: 'Non Applicant',
                password_hash: 'hash',
                role: 'employer'
            });

            const result = await resumeRepository.checkResumeOwner(nonApplicantUser._id, testResume._id);
            expect(result).toBe(false);
        });
    });
});