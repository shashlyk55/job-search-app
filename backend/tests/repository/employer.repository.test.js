const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const employerRepository = require('../../repositories/employer.repository');
const Models = require('../../models/Models');

describe('employerRepository', () => {
    let mongoServer;
    let testUser;
    let testEmployer;

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
            name: 'Test Employer',
            password_hash: 'hashed_password',
            contacts: {
                email: 'employer@example.com',
                phone: '+1234567890'
            },
            role: 'employer'
        });

        testEmployer = await Models.Employer.create({
            user: testUser._id,
            company: {
                company_regnum: '123456789',
                name: 'Test Company'
            }
        });
    });

    afterEach(async () => {
        await Promise.all([
            Models.User.deleteMany({}),
            Models.Employer.deleteMany({})
        ]);
    });

    describe('add', () => {
        it('should create and return a new employer without password_hash', async () => {
            const newUser = await Models.User.create({
                name: 'New Employer',
                password_hash: 'hash',
                role: 'employer'
            });

            const result = await employerRepository.add(newUser._id);

            expect(result.user._id.toString()).toBe(newUser._id.toString());
            expect(result.user.password_hash).toBeUndefined();

            // Проверяем сохранение в БД
            const dbEmployer = await Models.Employer.findById(result._id);
            expect(dbEmployer).not.toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete employer and return deleted document', async () => {
            const result = await employerRepository.delete(testEmployer._id);

            expect(result._id.toString()).toBe(testEmployer._id.toString());

            // Проверяем удаление из БД
            const dbEmployer = await Models.Employer.findById(testEmployer._id);
            expect(dbEmployer).toBeNull();
        });
    });

    describe('getByEmployerId', () => {
        it('should return employer by id without password_hash', async () => {
            const result = await employerRepository.getByEmployerId(testEmployer._id);

            expect(result._id.toString()).toBe(testEmployer._id.toString());
            expect(result.user.password_hash).toBeUndefined();
        });

        it('should return null for non-existent id', async () => {
            const result = await employerRepository.getByEmployerId(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('getOne', () => {
        it('should return employer by user id without password_hash', async () => {
            const result = await employerRepository.getOne(testUser._id);

            expect(result._id.toString()).toBe(testEmployer._id.toString());
            expect(result.user.password_hash).toBeUndefined();
        });

        it('should return null for non-existent user id', async () => {
            const result = await employerRepository.getOne(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all employers without password_hash', async () => {
            // Создаем второго работодателя
            const anotherUser = await Models.User.create({
                name: 'Another Employer',
                password_hash: 'hash',
                role: 'employer'
            });
            await Models.Employer.create({ user: anotherUser._id });

            const result = await employerRepository.getAll();

            expect(result).toHaveLength(2);
            expect(result[0].user.password_hash).toBeUndefined();
            expect(result[1].user.password_hash).toBeUndefined();
        });

        it('should return empty array if no employers', async () => {
            await Models.Employer.deleteMany({});
            const result = await employerRepository.getAll();
            expect(result).toEqual([]);
        });
    });

    describe('editProfile', () => {
        it('should update user profile and return updated data without password_hash', async () => {
            const updates = {
                name: 'Updated Employer Name',
                contacts: {
                    email: 'updated@example.com',
                    phone: '+9876543210'
                }
            };

            const result = await employerRepository.editProfile(
                testUser._id,
                updates.name,
                updates.contacts
            );

            expect(result.name).toBe('Updated Employer Name');
            expect(result.contacts.email).toBe('updated@example.com');
            expect(result.contacts.phone).toBe('+9876543210');
            expect(result.password_hash).toBeUndefined();

            // Проверяем обновление в БД
            const dbUser = await Models.User.findById(testUser._id);
            expect(dbUser.name).toBe('Updated Employer Name');
        });
    });

    describe('getProfile', () => {
        it('should return employer profile with user data without password_hash', async () => {
            const result = await employerRepository.getProfile(testUser._id);

            expect(result.user._id.toString()).toBe(testUser._id.toString());
            expect(result.user.password_hash).toBeUndefined();
            expect(result.company.company_regnum).toBe('123456789');
        });

        it('should return null if profile not found', async () => {
            const result = await employerRepository.getProfile(new mongoose.Types.ObjectId());
            expect(result).toBeNull();
        });
    });

    describe('editEmployerCompany', () => {
        it('should update company data and return updated employer', async () => {
            const companyUpdate = {
                company_regnum: '999999999',
                name: 'New Company Name'
            };

            const requestedCompany = '888888888'

            const result = await employerRepository.editEmployerCompany(
                testUser._id,
                companyUpdate,
                requestedCompany
            );

            expect(result.company.company_regnum).toBe('999999999');
            expect(result.requested_company).toBe('888888888');
            expect(result.user.password_hash).toBeUndefined();

            // Проверяем обновление в БД
            const dbEmployer = await Models.Employer.findById(testEmployer._id);
            expect(dbEmployer.company.company_regnum).toBe('999999999');
        });
    });
});