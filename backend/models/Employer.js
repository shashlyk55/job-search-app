const mongoose = require('mongoose')

const EmployerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
        requested_company: {
            type: String,
            required: false,
            default: null
        }
    },
    {
        timestamps: true
    }
)


EmployerSchema.pre('save', (next) => {
    if (this.email && !this.email.contacts.email) {
        this.contacts.email = this.email
    }
    next()
})


const EmployerModel = mongoose.model('Employer', EmployerSchema)
module.exports = EmployerModel