const Models = require('../models/Models')

const userRepository = {
    findUserByEmail: async (email) => {
        return user = await Models.User.findOne(
            { 'contacts.email': email }
        )
    },
    findUserById: async (id) => {
        return user = await Models.User.findById(id)
    },
    add: async (user) => {
        const newUser = new Models.User(user)
        return await newUser.save()
    },
    isUserExists: async (userId) => {
        const isExists = await Models.User.exists({ _id: userId })
        return !!isExists
    },
    getRole: async (userId) => {
        const result = await Models.User.findById(
            userId,
            { role: 1 }
        )
        return result.role
    },
    getAllUsers: async () => {
        const users = await Models.User.find({},
            { password_hash: 0 }
        )
        return users
    },
    getUser: async (userId) => {
        const user = await Models.User.findById(userId,
            { password_hash: 0 }
        )
        return user
    },
    edit: async (userId, user) => {
        const editedUser = await Models.User.findByIdAndUpdate(
            userId,
            { $set: { ...user } },
            { new: true }
        )
        return editedUser
    },
    delete: async (userId) => {
        const deletedUser = await Models.User.findByIdAndDelete(userId,
            { new: true }
        )
        // await Models.Applicant.findOneAndDelete({ user: userId })
        // await Models.Employer.findOneAndDelete({ user: userId })
        return deletedUser
    }

}


module.exports = userRepository