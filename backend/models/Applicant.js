const mongoose = require('mongoose')

const ApplicantSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        resumes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
        }]
    },
    {
        timestamps: true,
    }
)

ApplicantSchema.pre('save', function (next) {
    if(this.email && !this.contacts.email){
        this.contacts.email = this.email
    }
    next()
})


const ApplicantModel = mongoose.model('Applicant', ApplicantSchema)
module.exports = ApplicantModel
