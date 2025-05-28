const mongoose = require('mongoose')

const JoinCompanyRequestSchema = new mongoose.Schema(
    {
        company_regnum: {
            type: String,
            required: true
        },
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: true
        },
        pinned_message: {
            type: String,
            required: false
        },
        company: {
            type: {
                company_regnum: {
                    type: String,
                    required: true,
                },
                boss_contacts: {
                    email: {
                        type: String,
                        required: false,
                    },
                    phone: [{
                        type: String,
                        required: false,
                    }]
                },
                activity: {
                    type: String,
                    required: false,
                },
                name: {
                    type: String,
                    required: true,
                }
            },
            required: false,
            default: null,
        },
    },
    {
        timestamps: true
    }
)


const JoinCompanyRequestModel = mongoose.model('JoinCompanyRequest', JoinCompanyRequestSchema)
module.exports = JoinCompanyRequestModel




