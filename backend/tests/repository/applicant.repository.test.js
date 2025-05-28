const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const applicantRepository = require('../../repositories/applicant.repository');
const Models = require('../../models/Models');

describe('applicantRepository', () => {
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
            contacts: {
                email: 'test@example.com',
                phone: '+1234567890'
            },
            role: 'applicant'
        });

        testApplicant = await Models.Applicant.create({
            user: testUser._id,
            resumes: []
        });

        testResume = await Models.Resume.create({
            applicant_id: testApplicant._id,
            name: 'Test Resume',
            skills: ['JavaScript', 'Node.js']
        });
    });

    afterEach(async () => {
        await Promise.all([
            Models.User.deleteMany({}),
            Models.Applicant.deleteMany({}),
            Models.Resume.deleteMany({})
        ]);
    });

    describe('addApplicant', () => {
        it('should create and return a new applicant', async () => {
            const newUser = await Models.User.create({
                name: 'New User',
                password_hash: 'hash',
                role: 'applicant'
            });

            const result = await applicantRepository.addApplicant(newUser._id);

            expect(result.user.toString()).toBe(newUser._id.toString());
            expect(result.resumes).toEqual([]);

            const dbApplicant = await Models.Applicant.findById(result._id);
            expect(dbApplicant).not.toBeNull();
        });
    });

    describe('isExists', () => {
        it('should return true if applicant exists for user', async () => {
            const result = await applicantRepository.isExists(testUser._id);
            expect(result).toBeTruthy();
        });

        it('should return false if applicant does not exist for user', async () => {
            const newUser = await Models.User.create({
                name: 'New User',
                password_hash: 'hash',
                role: 'applicant'
            });

            const result = await applicantRepository.isExists(newUser._id);
            expect(result).toBeFalsy();
        });
    });

    describe('getByApplicantId', () => {
        it('should return applicant by id', async () => {
            const result = await applicantRepository.getByApplicantId(testApplicant._id);
            expect(result.user.toString()).toBe(testUser._id.toString());
        });

        it('should return null for non-existent id', async () => {
            const result = await applicantRepository.getByApplicantId(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('getByUserId', () => {
        it('should return applicant by user id', async () => {
            const result = await applicantRepository.getByUserId(testUser._id);
            expect(result._id.toString()).toBe(testApplicant._id.toString());
        });

        it('should return null for non-existent user id', async () => {
            const result = await applicantRepository.getByUserId(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('getProfile', () => {
        it('should return applicant profile with populated user and resumes', async () => {
            // Добавляем резюме к аппликанту
            await applicantRepository.addResume(testUser._id, testResume._id);

            const result = await applicantRepository.getProfile(testUser._id);

            expect(result[0].user.name).toBe('Test User');
            expect(result[0].user.password_hash).toBeUndefined(); // Проверяем исключение password_hash
            expect(result[0].resumes[0].name).toBe('Test Resume');
        });

        it('should return empty array if profile not found', async () => {
            const result = await applicantRepository.getProfile(new mongoose.Types.ObjectId());
            expect(result).toEqual([]);
        });
    });

    describe('editProfile', () => {
        it('should update user profile and return updated data', async () => {
            const updates = {
                name: 'Updated Name',
                contacts: {
                    email: 'updated@example.com',
                    phone: '+9876543210'
                }
            };

            const result = await applicantRepository.editProfile(
                testUser._id,
                updates.name,
                updates.contacts
            );

            expect(result.name).toBe('Updated Name');
            expect(result.contacts.email).toBe('updated@example.com');
            expect(result.contacts.phone).toBe('+9876543210');
            expect(result.password_hash).toBeUndefined(); // Проверяем исключение password_hash

            // Проверяем обновление в БД
            const dbUser = await Models.User.findById(testUser._id);
            expect(dbUser.name).toBe('Updated Name');
        });
    });

    describe('getApplicantByEmail', () => {
        it('should return user by email', async () => {
            const result = await applicantRepository.getApplicantByEmail('test@example.com');
            expect(result._id.toString()).toBe(testUser._id.toString());
        });

        it('should return null for non-existent email', async () => {
            const result = await applicantRepository.getApplicantByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });
    });

    describe('getApplicantByPhone', () => {
        it('should return user by phone', async () => {
            const result = await applicantRepository.getApplicantByPhone('+1234567890');
            expect(result._id.toString()).toBe(testUser._id.toString());
        });

        it('should return null for non-existent phone', async () => {
            const result = await applicantRepository.getApplicantByPhone('+0000000000');
            expect(result).toBeNull();
        });
    });

    describe('addResume', () => {
        it('should add resume to applicant and return updated applicant', async () => {
            const newResume = await Models.Resume.create({
                applicant_id: testApplicant._id,
                name: 'New Resume'
            });

            const result = await applicantRepository.addResume(testUser._id, newResume._id);

            expect(result.resumes.length).toBe(1);
            expect(result.resumes[0].toString()).toBe(newResume._id.toString());

            // Проверяем обновление в БД
            const dbApplicant = await Models.Applicant.findById(testApplicant._id);
            expect(dbApplicant.resumes.length).toBe(1);
        });
    });

    describe('deleteResume', () => {
        it('should remove resume from applicant and return updated applicant', async () => {
            // Сначала добавляем резюме
            await applicantRepository.addResume(testUser._id, testResume._id);

            const result = await applicantRepository.deleteResume(testUser._id, testResume._id);

            expect(result.resumes.length).toBe(0);

            // Проверяем обновление в БД
            const dbApplicant = await Models.Applicant.findById(testApplicant._id);
            expect(dbApplicant.resumes.length).toBe(0);
        });

        it('should do nothing if resume not in applicant list', async () => {
            const newResume = await Models.Resume.create({
                applicant_id: testApplicant._id,
                name: 'New Resume'
            });

            const result = await applicantRepository.deleteResume(testUser._id, newResume._id);
            expect(result.resumes.length).toBe(0);
        });
    });
});