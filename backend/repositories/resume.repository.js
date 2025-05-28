const Resume = require('../models/Models').Resume
const Models = require('../models/Models')

const resumeRepository = {
    addResume: async (resume) => {
        const newResume = new Resume(resume)
        return await newResume.save()
    },
    getApplicantResumes: async (applicantId) => {
        return await Resume.find({ applicant_id: applicantId })
    },
    getOne: async (resumeId) => {
        return await Resume.findById(resumeId)
    },
    editResume: async (resumeId, resume) => {
        const editedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { $set: { ...resume } }, // work_experience останется неизменным, если ты её не передаёшь в $set
            { new: true }
        )
        return editedResume
    },
    deleteResume: async (resumeId) => {
        return await Resume.findByIdAndDelete(resumeId)
    },
    addWorkExp: async (resumeId, works) => {
        const editedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { $push: { work_experience: { $each: works } } },
            { new: true }
        )

        return editedResume
    },
    editWorkExp: async (resumeId, works) => {
        const editedResume = await Resume.findById(resumeId);
        editedResume.work_experience.forEach((item, index) => {
            const updateData = works.find((work) => work.id === item.id);
            if (updateData) {
                editedResume.work_experience[index] = { ...item.toObject(), ...updateData, _id: item._id };
            }
        });
        await editedResume.save();
        return editedResume
    },
    deleteWorkExp: async (resumeId, works) => {
        const resume = await Resume.findByIdAndUpdate(
            resumeId,
            { $pull: { work_experience: { _id: { $in: works } } } },
            { new: true }
        );
        return resume
    },
    isResumeExists: async (resumeId) => {
        return await Resume.exists({ _id: resumeId })
    },
    checkResumeOwner: async (userId, resumeId) => {
        const applicant = await Models.Applicant.findOne({ user: userId })
        if (!applicant)
            return false
        const applicantId = applicant.id
        const resume = await Resume.findById(resumeId)
        if (!resume)
            return false
        return resume.applicant_id == applicantId
    },
    deleteResumesForApplicant: async (applicantId) => {
        await Models.Resume.deleteMany({ applicant_id: applicantId })
    },
}

module.exports = resumeRepository