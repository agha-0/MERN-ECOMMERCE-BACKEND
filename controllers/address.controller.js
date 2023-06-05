const addressSchema = require('../models/address.modal')
const { ObjectId } = require('mongodb');


// Add Address
const add_address = async (req, res) => {
    try {
        const userID = req.userId;
        if (!userID)
            return res.json({ message: 'Invalid user', success: false, response_code: 201 })
        const { name, address_line_1, address_line_2, provence, city, phone_number } = req.body
        if (!name)
            return res.json({ message: "name can't be empty", success: false, response_code: 201 })
        if (!address_line_2)
            return res.json({ message: "address_line_2 can't be empty", success: false, response_code: 201 })
        if (!provence)
            return res.json({ message: "provence can't be empty", success: false, response_code: 201 })
        if (!city)
            return res.json({ message: "city can't be empty", success: false, response_code: 201 })
        if (!phone_number)
            return res.json({ message: "phone_number can't be empty", success: false, response_code: 201 })

        const existingMobile = await addressSchema.findOne({ phone_number: phone_number })
        if (existingMobile) return res.json({ message: "Email already Exists", success: false, response_code: 201 })

        const result = await addressSchema.create({
            user_id: userID,
            name: name,
            address_line_1: address_line_1,
            address_line_2: address_line_2,
            provence: provence,
            city: city,
            phone_number: phone_number,
        })
        res.status(201).json({ data: result, message: "Successfully Added!", response_code: 200, success: true })
    } catch (error) {
        return res.json({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201, })
    }
}

const get_Address = async (req, res) => {
    try {
        const userID = req.userId;

        // const address = await addressSchema.findById({ userID: userID });
        const address = await addressSchema.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    'user._id': new ObjectId(userID)
                }
            }
        ])

        res.status(200).json({ data: address, message: "Address", response_code: 200, success: true, })
    } catch (error) {
        return res.json({ message: error.message, success: false, response_code: 201, })
        // return res.json({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201, })

    }
}

module.exports = {
    add_address, get_Address
}