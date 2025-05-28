const UserService = require('../../services/user.service');
const Repositories = require('../../repositories/repositories');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../../errors/AppError');

// Мокаем все зависимости
jest.mock('../../repositories/repositories');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('UserService', () => {
    const mockUser = {
        _id: '1',
        _doc: {
            _id: '1',
            contacts: { email: 'test@example.com' },
            password_hash: 'hashed_password',
            role: 'applicant'
        },
        id: '1' // Добавляем id для корректной работы тестов
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Мокаем bcrypt
        bcrypt.hash.mockImplementation((pass) => Promise.resolve(`hashed_${pass}`));
        bcrypt.compare.mockImplementation((pass, hash) =>
            Promise.resolve(hash === `hashed_${pass}`)
        );

        // Мокаем jwt
        jwt.sign.mockReturnValue('generated_token');
    });

    describe('register', () => {

        it('should register a new applicant user', async () => {
            const userData = {
                contacts: { email: 'new@example.com' },
                password: 'password123',
                role: 'applicant'
            };

            // Настраиваем моки для этого теста
            Repositories.User.findUserByEmail.mockResolvedValue(null);
            Repositories.User.add.mockResolvedValue(mockUser);
            Repositories.Applicant.addApplicant.mockResolvedValue({ id: '1' });

            const result = await UserService.register(userData);

            // Проверяем вызовы
            expect(Repositories.User.findUserByEmail).toHaveBeenCalledWith(userData.contacts.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);

            // Проверяем что User.add вызван с правильными аргументами
            expect(Repositories.User.add).toHaveBeenCalledWith({
                ...userData,
                password_hash: 'hashed_password123' // Теперь хеш будет корректным
            });

            // Проверяем создание applicant
            expect(Repositories.Applicant.addApplicant).toHaveBeenCalledWith('1');

            // Проверяем генерацию токена
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: '1' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            expect(result.token).toBe('generated_token');
        });

        it('should throw error if email already exists', async () => {
            Repositories.User.findUserByEmail.mockResolvedValue(mockUser);

            await expect(UserService.register({
                contacts: { email: 'existing@example.com' },
                password: 'password123',
                role: 'applicant'
            })).rejects.toThrow(new AppError(400, 'email уже используется'));
        });
    });

    describe('login', () => {
        it('should login user with correct credentials', async () => {
            // Настраиваем моки для этого теста
            Repositories.User.findUserByEmail.mockResolvedValue({
                ...mockUser,
                password_hash: 'hashed_password123'
            });

            const result = await UserService.login('test@example.com', 'password123');

            // Проверяем вызовы
            expect(Repositories.User.findUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith(
                'password123',
                'hashed_password123'
            );
            expect(result.token).toBe('generated_token');
        });

        it('should throw error for non-existent user', async () => {
            Repositories.User.findUserByEmail.mockResolvedValue(null);

            await expect(UserService.login('wrong@example.com', 'password123'))
                .rejects.toThrow(new AppError(401, 'Неверный email или пароль'));
        });

        it('should throw error for wrong password', async () => {
            Repositories.User.findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(UserService.login('test@example.com', 'wrong_password'))
                .rejects.toThrow(new AppError(401, 'Неверный email или пароль'));
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [mockUser];
            Repositories.User.getAllUsers.mockResolvedValue(mockUsers);

            const result = await UserService.getAllUsers();

            expect(Repositories.User.getAllUsers).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getUser', () => {
        it('should return user by id', async () => {
            Repositories.User.getUser.mockResolvedValue(mockUser);

            const result = await UserService.getUser('1');

            expect(Repositories.User.getUser).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockUser);
        });
    });

    describe('editUser', () => {
        it('should edit user', async () => {
            const updatedUser = { ...mockUser, name: 'Updated' };
            Repositories.User.edit.mockResolvedValue(updatedUser);

            const result = await UserService.editUser('1', { name: 'Updated' });

            expect(Repositories.User.edit).toHaveBeenCalledWith('1', { name: 'Updated' });
            expect(result).toEqual(updatedUser);
        });
    });

    describe('deleteUser', () => {
        it('should delete user', async () => {
            Repositories.User.getRole.mockResolvedValue('applicant');
            Repositories.User.delete.mockResolvedValue(true);

            const result = await UserService.deleteUser('1');

            expect(Repositories.User.getRole).toHaveBeenCalledWith('1');
            expect(Repositories.User.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });
    });
});