const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }, 
        email: {
            type: String,
            required: false,
            match: [/^\S+@\S+\.\S+$/, 'некорректный email'],
            default: null,
        },
        description: {
            type: String,
            required: false,
            default: null,
        }
    },
    {
        timestamps: true
    }
)


const CompanyModel = mongoose.model('Company', CompanySchema)
module.exports = CompanyModel




