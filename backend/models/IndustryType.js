const mongoose = require('mongoose')

const IndustryTypeSchema = new mongoose.Schema(
    {
        industry_type: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)


const IndustryTypeModel = mongoose.model('IndustryType', IndustryTypeSchema)
module.exports = IndustryTypeModel