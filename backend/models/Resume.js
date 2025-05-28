const mongoose = require('mongoose')

const ResumeSchema = new mongoose.Schema(
    {
        applicant_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        biography: {
            type: String,
            required: false,
        },
        skills: {
            type: [{
                type: String,
                maxlength: 20
            }],
            validate: {
                validator: function(arr) {
                    return arr.length <= 15
                },
                message: 'Массив skills не должен содержать более 15 элементов'
            }
        },
        work_experience: [{
            company: {
                type: String,
                required: true,
            },
            position: {
                type: String,
                required: true,
            },
            years_of_work: {
                type: Number,
                required: false,
            }
        }]
    },
    {
        timestamps: true,
    }
)


const ResumeModel = mongoose.model('Resume', ResumeSchema)
module.exports = ResumeModel

