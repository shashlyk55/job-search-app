const mongoose = require('mongoose')

const ResponseSchema = new mongoose.Schema(
    {
        applicant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant',
            required: true
        },
        vacancy_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vacancy',
            required: true
        },
        resume_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
            required: true
        },
        is_approved: {
            type: Boolean,
            required: false,
            default: null
        },
        applicant_pinned_message: {
            type: String,
            required: false,
            default: null,
        },
        employer_pinned_message: {
            type: String,
            required: false,
            default: null,
        }
    },
    {
        timestamps: true
    }
)

const ResponseModel = mongoose.model('Response', ResponseSchema)
module.exports = ResponseModel


