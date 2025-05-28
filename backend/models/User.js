const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        contacts: {
            email: {
                type: String,
                required: false,
                match: [/^\S+@\S+\.\S+$/, 'некорректный email'],
            },
            phone: {
                type: String,
                required: false,
                match: [/^\+?\d{10,15}$/, 'некорректный номер телефона'],
                default: null
            }   
        },
        role: {
            type: String,
            enum: ['applicant', 'employer', 'admin'],
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel
