
const ApplicantService = require('../../services/applicant.service');
const Repositories = require('../../repositories/repositories');
const AppError = require('../../errors/AppError');

jest.mock('../../repositories/repositories');

describe('ApplicantService', () => {

    const mockUserId = 'user123';
    const mockProfile = {
        id: mockUserId,
        name: 'John Doe',
        contacts: {
            email: 'john@example.com',
            phone: '+1234567890'
        }
    };

    const mockOtherApplicant = {
        id: 'other456',
        name: 'Other User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getApplicantProfile', () => {
        it('should return applicant profile if exists', async () => {
            Repositories.Applicant.getProfile.mockResolvedValue(mockProfile);

            const result = await ApplicantService.getApplicantProfile(mockUserId);

            expect(Repositories.Applicant.getProfile).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockProfile);
        });

        it('should throw 404 if profile not found', async () => {
            Repositories.Applicant.getProfile.mockResolvedValue(null);

            await expect(ApplicantService.getApplicantProfile(mockUserId))
                .rejects.toThrow(new AppError(404, 'Профиль не найден'));
        });
    });

    describe('editApplicantProfile', () => {
        it('should edit profile with valid data', async () => {
            const updatedProfile = {
                name: 'Updated Name',
                contacts: {
                    email: 'updated@example.com',
                    phone: '+9876543210'
                }
            };

            Repositories.Applicant.isExists.mockResolvedValue(true);
            Repositories.Applicant.getApplicantByEmail.mockResolvedValue(null);
            Repositories.Applicant.getApplicantByPhone.mockResolvedValue(null);
            Repositories.Applicant.editProfile.mockResolvedValue(updatedProfile);

            const result = await ApplicantService.editApplicantProfile(mockUserId, updatedProfile);

            expect(Repositories.Applicant.isExists).toHaveBeenCalledWith(mockUserId);
            expect(Repositories.Applicant.getApplicantByEmail).toHaveBeenCalledWith(updatedProfile.contacts.email);
            expect(Repositories.Applicant.getApplicantByPhone).toHaveBeenCalledWith(updatedProfile.contacts.phone);
            expect(Repositories.Applicant.editProfile).toHaveBeenCalledWith(
                mockUserId,
                updatedProfile.name,
                updatedProfile.contacts
            );
            expect(result).toEqual(updatedProfile);
        });

        it('should throw 404 if profile not exists', async () => {
            Repositories.Applicant.isExists.mockResolvedValue(false);

            await expect(ApplicantService.editApplicantProfile(mockUserId, {}))
                .rejects.toThrow(new AppError(404, 'Профиль не найден'));
        });

        it('should throw 400 if email is taken by another user', async () => {
            Repositories.Applicant.isExists.mockResolvedValue(true);
            Repositories.Applicant.getApplicantByEmail.mockResolvedValue(mockOtherApplicant);

            await expect(ApplicantService.editApplicantProfile(mockUserId, {
                name: 'John',
                contacts: { email: 'taken@example.com' }
            })).rejects.toThrow(new AppError(400, 'Данный email занят'));
        });

        it('should allow same email for current user', async () => {
            Repositories.Applicant.isExists.mockResolvedValue(true);
            Repositories.Applicant.getApplicantByEmail.mockResolvedValue({ ...mockProfile, id: mockUserId });
            Repositories.Applicant.getApplicantByPhone.mockResolvedValue(null);
            Repositories.Applicant.editProfile.mockResolvedValue(mockProfile);

            await expect(ApplicantService.editApplicantProfile(mockUserId, {
                name: 'John',
                contacts: { email: mockProfile.contacts.email }
            })).resolves.toEqual(mockProfile);
        });

        it('should throw 400 if phone is taken by another user', async () => {
            Repositories.Applicant.isExists.mockResolvedValue(true);
            Repositories.Applicant.getApplicantByEmail.mockResolvedValue(null);
            Repositories.Applicant.getApplicantByPhone.mockResolvedValue(mockOtherApplicant);

            await expect(ApplicantService.editApplicantProfile(mockUserId, {
                name: 'John',
                contacts: { phone: '+1111111111' }
            })).rejects.toThrow(new AppError(400, 'Данный телефон занят'));
        });
    });
});