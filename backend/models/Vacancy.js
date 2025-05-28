const mongoose = require('mongoose')

const VacancySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        describe: {
            type: String,
            required: true,
        },
        salary_amount: {
            type: Number,
            required: function () { return !!this.currency; },
            default: null
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'RUB', 'BYN'],
            required: function () { return !!this.salary_amount; }
        },
        required_experience: {  // в годах
            type: Number,
            required: false,
            default: null,
        },
        company: {
            type: {
                company_regnum: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true
                },
                activity: {
                    type: String,
                    required: false
                }
            },
            required: true,
        },
        industry_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'IndustryType',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)


const VacancyModel = mongoose.model('Vacancy', VacancySchema)
module.exports = VacancyModel


