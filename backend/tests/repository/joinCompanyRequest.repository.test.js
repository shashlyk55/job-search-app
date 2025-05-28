const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const JoinCompanyRequestRepository = require('../../repositories/joinCompanyRequest.repository');
const Models = require('../../models/Models');

describe('JoinCompanyRequestRepository', () => {
    let mongoServer;
    let testUser;
    let testEmployer;
    let testRequest;

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
        // Create test data
        testUser = await Models.User.create({
            name: 'Test Employer',
            password_hash: 'hashed_password',
            contacts: { email: 'employer@test.com', phone: '+1234567890' },
            role: 'employer'
        });

        testEmployer = await Models.Employer.create({
            user: testUser._id
        });

        testRequest = await Models.JoinCompanyRequest.create({
            company_regnum: '123456789',
            employer: testEmployer._id,
            pinned_message: 'Please accept my request',
            company: {
                company_regnum: '123456789',
                name: 'Test Company',
                boss_contacts: {
                    email: 'ceo@test.com',
                    phone: ['+1234567890']
                },
                activity: 'IT Services'
            }
        });
    });

    afterEach(async () => {
        await Promise.all([
            Models.User.deleteMany({}),
            Models.Employer.deleteMany({}),
            Models.JoinCompanyRequest.deleteMany({})
        ]);
    });

    describe('getAll', () => {
        it('should return all requests with populated employer and user data', async () => {
            const result = await JoinCompanyRequestRepository.getAll();

            expect(result).toHaveLength(1);
            expect(result[0].company_regnum).toBe('123456789');
            expect(result[0].pinned_message).toBe('Please accept my request');
            expect(result[0].company.name).toBe('Test Company');
            expect(result[0].employer.user.name).toBe('Test Employer');
        });
    });

    describe('getById', () => {
        it('should return request by ID with all fields populated', async () => {
            const result = await JoinCompanyRequestRepository.getById(testRequest._id);

            expect(result.company_regnum).toBe('123456789');
            expect(result.company.boss_contacts.email).toBe('ceo@test.com');
            expect(result.employer.user.contacts.phone).toBe('+1234567890');
        });
    });

    describe('getOne', () => {
        it('should find request by employerId and company_regnum with company details', async () => {
            const result = await JoinCompanyRequestRepository.getOne(
                testEmployer._id,
                '123456789'
            );

            expect(result.company.activity).toBe('IT Services');
            expect(result.company.boss_contacts.phone[0]).toBe('+1234567890');
        });
    });

    describe('add', () => {
        it('should create new request with all required fields', async () => {
            const newRequest = {
                company_regnum: '987654321',
                employer: testEmployer._id,
                pinned_message: 'New request message',
                company: {
                    company_regnum: '987654321',
                    name: 'New Company',
                    boss_contacts: {
                        email: 'new@company.com'
                    }
                }
            };

            const result = await JoinCompanyRequestRepository.add(newRequest);

            expect(result.company.name).toBe('New Company');
            expect(result.pinned_message).toBe('New request message');

            // Verify optional field
            expect(result.company.activity).toBeUndefined();
        });

        it('should create request without company details when not provided', async () => {
            const minimalRequest = {
                company_regnum: '987654321',
                employer: testEmployer._id,
                pinned_message: 'Minimal request'
            };

            const result = await JoinCompanyRequestRepository.add(minimalRequest);
            expect(result.company).toBeNull();
        });
    });

    describe('findDuplicate', () => {
        it('should find duplicates with same employer and company_regnum', async () => {
            // Create duplicate request
            await JoinCompanyRequestRepository.add({
                company_regnum: '123456789',
                employer: testEmployer._id,
                pinned_message: 'Duplicate request',
                company: {
                    company_regnum: '123456789',
                    name: 'Same Company'
                }
            });

            const result = await JoinCompanyRequestRepository.findDuplicate(
                testEmployer._id,
                '123456789'
            );

            expect(result).toHaveLength(2);
            expect(result[0].pinned_message).toBe('Please accept my request');
            expect(result[1].pinned_message).toBe('Duplicate request');
        });
    });

    describe('delete', () => {
        it('should delete request and return deleted document with all fields', async () => {
            const result = await JoinCompanyRequestRepository.delete(testRequest._id);

            expect(result.company.name).toBe('Test Company');
            expect(result.pinned_message).toBe('Please accept my request');

            // Verify deletion
            const dbRequest = await Models.JoinCompanyRequest.findById(testRequest._id);
            expect(dbRequest).toBeNull();
        });
    });

    // Edge case tests
    describe('Edge Cases', () => {
        it('should handle request with multiple boss phone numbers', async () => {
            const requestWithMultiplePhones = {
                company_regnum: '555555555',
                employer: testEmployer._id,
                pinned_message: 'Multiple phones',
                company: {
                    company_regnum: '555555555',
                    name: 'Phone Company',
                    boss_contacts: {
                        phone: ['+1111111111', '+2222222222']
                    }
                }
            };

            const result = await JoinCompanyRequestRepository.add(requestWithMultiplePhones);
            expect(result.company.boss_contacts.phone).toHaveLength(2);
        });

        it('should handle request without boss contacts email', async () => {
            const requestWithoutEmail = {
                company_regnum: '444444444',
                employer: testEmployer._id,
                pinned_message: 'No email',
                company: {
                    company_regnum: '444444444',
                    name: 'No Email Company',
                    boss_contacts: {
                        phone: ['+3333333333']
                    }
                }
            };

            const result = await JoinCompanyRequestRepository.add(requestWithoutEmail);
            expect(result.company.boss_contacts.email).toBeUndefined();
        });
    });
});