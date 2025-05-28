const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Models = require('../../models/Models');
const userRepository = require('../../repositories/user.repository');

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
    await mongoose.connection.db.dropDatabase();
});

describe('userRepository', () => {
    // Тестовые данные
    const testUser = {
        contacts: { email: 'test@example.com' },
        name: 'Test User',
        role: 'applicant',
        password_hash: 'hashed_password'
    };

    // 1. Тест добавления пользователя
    describe('add', () => {
        it('should add a new user to the database', async () => {
            const newUser = await userRepository.add(testUser);

            // Проверяем, что пользователь сохранен в БД
            const userInDb = await Models.User.findById(newUser._id);
            expect(userInDb).not.toBeNull();
            expect(userInDb.contacts.email).toBe(testUser.contacts.email);
            expect(userInDb.name).toBe(testUser.name);
            expect(userInDb.password_hash).toBe(testUser.password_hash);
        });
    });

    // 2. Тест поиска по email
    describe('findUserByEmail', () => {
        it('should find a user by email', async () => {
            await Models.User.create(testUser);
            const foundUser = await userRepository.findUserByEmail(testUser.contacts.email);

            expect(foundUser).not.toBeNull();
            expect(foundUser.contacts.email).toBe(testUser.contacts.email);
        });

        it('should return null if user does not exist', async () => {
            const foundUser = await userRepository.findUserByEmail('nonexistent@example.com');
            expect(foundUser).toBeNull();
        });
    });

    // 3. Тест поиска по ID
    describe('findUserById', () => {
        it('should find a user by ID', async () => {
            const savedUser = await Models.User.create(testUser);
            const foundUser = await userRepository.findUserById(savedUser._id);

            expect(foundUser).not.toBeNull();
            expect(foundUser._id.toString()).toBe(savedUser._id.toString());
        });

        it('should return null if user does not exist', async () => {
            const foundUser = await userRepository.findUserById('507f1f77bcf86cd799439011');
            expect(foundUser).toBeNull();
        });
    });

    // 4. Тест проверки существования пользователя
    describe('isUserExists', () => {
        it('should return true if user exists', async () => {
            const savedUser = await Models.User.create(testUser);
            const exists = await userRepository.isUserExists(savedUser.id);

            expect(exists).toBe(true);
        });

        it('should return false if user does not exist', async () => {
            const exists = await userRepository.isUserExists('507f1f77bcf86cd799439011');
            expect(exists).toBe(false);
        });
    });

    // 5. Тест получения роли
    describe('getRole', () => {
        it('should return the user role', async () => {
            const savedUser = await Models.User.create(testUser);
            const role = await userRepository.getRole(savedUser._id);

            expect(role).toBe(testUser.role);
        });
    });

    // 6. Тест получения всех пользователей
    describe('getAllUsers', () => {
        it('should return all users without password_hash', async () => {
            await Models.User.create(testUser);
            const users = await userRepository.getAllUsers();

            expect(users.length).toBe(1);
            expect(users[0].password_hash).toBeUndefined();
        });
    });

    // 7. Тест получения пользователя
    describe('getUser', () => {
        it('should return a user without password_hash', async () => {
            const savedUser = await Models.User.create(testUser);
            const user = await userRepository.getUser(savedUser._id);

            expect(user._id.toString()).toBe(savedUser._id.toString());
            expect(user.password_hash).toBeUndefined();
        });
    });

    // 8. Тест редактирования пользователя
    describe('edit', () => {
        it('should update user data', async () => {
            const savedUser = await Models.User.create(testUser);
            const updates = { name: 'Updated Name' };

            const editedUser = await userRepository.edit(savedUser._id, updates);
            expect(editedUser.name).toBe(updates.name);

            // Проверяем, что изменения сохранились в БД
            const userInDb = await Models.User.findById(savedUser._id);
            expect(userInDb.name).toBe(updates.name);
        });
    });

    // 9. Тест удаления пользователя
    describe('delete', () => {
        it('should delete a user', async () => {
            const savedUser = await Models.User.create(testUser);
            const deletedUser = await userRepository.delete(savedUser._id);

            expect(deletedUser._id.toString()).toBe(savedUser._id.toString());

            // Проверяем, что пользователя больше нет в БД
            const userInDb = await Models.User.findById(savedUser._id);
            expect(userInDb).toBeNull();
        });
    });
});