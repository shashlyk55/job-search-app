const Models = require('../models/Models')

const OtherController = {
    getIndustries: async (req, res) => {
        try {
            const industries = await Models.IndustryType.find()

            return res.status(200).json(
                {
                    success: true,
                    industries: industries
                }
            )

        } catch (err) {
            return res.status(500).json(
                {
                    success: false,
                    message: 'Ошибка получения отраслей'
                }
            )
        }
    }

}

module.exports = OtherController