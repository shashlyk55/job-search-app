const ResumeService = require('../../services/resume.service');
const Repositories = require('../../repositories/repositories');
const AppError = require('../../errors/AppError');

jest.mock('../../repositories/repositories');

describe('ResumeService', () => {
    const mockUserId = 'user123';
    const mockApplicantId = 'applicant456';
    const mockResumeId = 'resume789';
    const mockWorkId = 'work111';

    const mockApplicant = {
        _id: mockApplicantId,
        id: mockApplicantId
    };

    const mockResume = {
        _id: mockResumeId,
        id: mockResumeId,
        applicant_id: mockApplicantId,
        work_experience: [{ _id: mockWorkId }]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getApplicantResumes', () => {
        it('should return resumes for applicant', async () => {
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicant);
            Repositories.Resume.getApplicantResumes.mockResolvedValue([mockResume]);

            const result = await ResumeService.getApplicantResumes(mockUserId);

            expect(Repositories.Applicant.getByUserId).toHaveBeenCalledWith(mockUserId);
            expect(Repositories.Resume.getApplicantResumes).toHaveBeenCalledWith(mockApplicantId);
            expect(result).toEqual([mockResume]);
        });
    });

    describe('getResume', () => {
        it('should return resume if exists and user is owner', async () => {
            Repositories.Resume.getOne.mockResolvedValue(mockResume);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(true);

            const result = await ResumeService.getResume(mockUserId, mockResumeId);

            expect(Repositories.Resume.getOne).toHaveBeenCalledWith(mockResumeId);
            expect(Repositories.Resume.checkResumeOwner).toHaveBeenCalledWith(mockUserId, mockResumeId);
            expect(result).toEqual(mockResume);
        });

        it('should throw 404 if resume not found', async () => {
            Repositories.Resume.getOne.mockResolvedValue(null);

            await expect(ResumeService.getResume(mockUserId, mockResumeId))
                .rejects.toThrow(new AppError(404, 'Резюме не найдено'));
        });

        it('should throw 403 if user is not owner', async () => {
            Repositories.Resume.getOne.mockResolvedValue(mockResume);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(false);

            await expect(ResumeService.getResume(mockUserId, mockResumeId))
                .rejects.toThrow(new AppError(403, 'Пользователь не является владельцем резюме'));
        });
    });

    describe('createResume', () => {
        it('should create new resume', async () => {
            const resumeData = { title: 'New Resume' };
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicant);
            Repositories.Resume.addResume.mockResolvedValue(mockResume);
            Repositories.Applicant.addResume.mockResolvedValue(true);

            const result = await ResumeService.createResume(mockUserId, resumeData);

            expect(Repositories.Applicant.getByUserId).toHaveBeenCalledWith(mockUserId);
            expect(Repositories.Resume.addResume).toHaveBeenCalledWith({
                ...resumeData,
                applicant_id: mockApplicantId
            });
            expect(Repositories.Applicant.addResume).toHaveBeenCalledWith(mockUserId, mockResumeId);
            expect(result).toEqual(mockResume);
        });

        it('should throw 500 if resume not created', async () => {
            Repositories.Applicant.getByUserId.mockResolvedValue(mockApplicant);
            Repositories.Resume.addResume.mockResolvedValue(null);

            await expect(ResumeService.createResume(mockUserId, {}))
                .rejects.toThrow(new AppError(500, 'Резюме не создано'));
        });
    });

    describe('editResume', () => {
        it('should edit existing resume', async () => {
            const updateData = { title: 'Updated Resume' };
            Repositories.Resume.isResumeExists.mockResolvedValue(true);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(true);
            Repositories.Resume.editResume.mockResolvedValue(mockResume);

            const result = await ResumeService.editResume(mockUserId, mockResumeId, updateData);

            expect(Repositories.Resume.isResumeExists).toHaveBeenCalledWith(mockResumeId);
            expect(Repositories.Resume.checkResumeOwner).toHaveBeenCalledWith(mockUserId, mockResumeId);
            expect(Repositories.Resume.editResume).toHaveBeenCalledWith(mockResumeId, updateData);
            expect(result).toEqual(mockResume);
        });

        it('should throw 404 if resume not found', async () => {
            Repositories.Resume.isResumeExists.mockResolvedValue(false);

            await expect(ResumeService.editResume(mockUserId, mockResumeId, {}))
                .rejects.toThrow(new AppError(404, 'Резюме не найдено'));
        });

        it('should throw 403 if user is not owner', async () => {
            Repositories.Resume.isResumeExists.mockResolvedValue(true);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(false);

            await expect(ResumeService.editResume(mockUserId, mockResumeId, {}))
                .rejects.toThrow(new AppError(403, 'Пользователь не является владельцем резюме'));
        });

        it('should throw 500 if resume not updated', async () => {
            Repositories.Resume.isResumeExists.mockResolvedValue(true);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(true);
            Repositories.Resume.editResume.mockResolvedValue(null);

            await expect(ResumeService.editResume(mockUserId, mockResumeId, {}))
                .rejects.toThrow(new AppError(500, 'Резюме не изменено'));
        });
    });

    describe('deleteResume', () => {
        it('should delete existing resume', async () => {
            Repositories.Resume.isResumeExists.mockResolvedValue(true);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(true);
            Repositories.Resume.deleteResume.mockResolvedValue(mockResume);
            Repositories.Applicant.deleteResume.mockResolvedValue(true);

            const result = await ResumeService.deleteResume(mockUserId, mockResumeId);

            expect(Repositories.Resume.isResumeExists).toHaveBeenCalledWith(mockResumeId);
            expect(Repositories.Resume.checkResumeOwner).toHaveBeenCalledWith(mockUserId, mockResumeId);
            expect(Repositories.Resume.deleteResume).toHaveBeenCalledWith(mockResumeId);
            expect(Repositories.Applicant.deleteResume).toHaveBeenCalledWith(mockUserId, mockResumeId);
            expect(result).toEqual(mockResume);
        });

        // Тесты на ошибки аналогичны editResume
    });

    describe('work experience methods', () => {
        const mockWorks = [{ company: 'Test Company' }];

        beforeEach(() => {
            Repositories.Resume.isResumeExists.mockResolvedValue(true);
            Repositories.Resume.checkResumeOwner.mockResolvedValue(true);
        });

        describe('addWorkExp', () => {
            it('should add work experience', async () => {
                Repositories.Resume.addWorkExp.mockResolvedValue(mockResume);

                const result = await ResumeService.addWorkExp(mockUserId, mockResumeId, mockWorks);

                expect(Repositories.Resume.addWorkExp).toHaveBeenCalledWith(mockResumeId, mockWorks);
                expect(result).toEqual(mockResume.work_experience);
            });

            it('should throw 500 if not updated', async () => {
                Repositories.Resume.addWorkExp.mockResolvedValue(null);

                await expect(ResumeService.addWorkExp(mockUserId, mockResumeId, mockWorks))
                    .rejects.toThrow(new AppError(500, 'Резюме не обновлено'));
            });
        });

        describe('editWorkExp', () => {
            it('should edit work experience', async () => {
                Repositories.Resume.editWorkExp.mockResolvedValue(mockResume);

                const result = await ResumeService.editWorkExp(mockUserId, mockResumeId, mockWorks);

                expect(Repositories.Resume.editWorkExp).toHaveBeenCalledWith(mockResumeId, mockWorks);
                expect(result).toEqual(mockResume.work_experience);
            });
        });

        describe('deleteWorkExp', () => {
            it('should delete work experience', async () => {
                Repositories.Resume.deleteWorkExp.mockResolvedValue(mockResume);

                const result = await ResumeService.deleteWorkExp(mockUserId, mockResumeId, [mockWorkId]);

                expect(Repositories.Resume.deleteWorkExp).toHaveBeenCalledWith(mockResumeId, [mockWorkId]);
                expect(result).toEqual(mockResume.work_experience);
            });
        });
    });
});