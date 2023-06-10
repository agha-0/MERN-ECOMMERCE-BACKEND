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
        if (!address_line_1)
            return res.json({ message: "address_line_1 can't be empty", success: false, response_code: 201 })
        if (!provence)
            return res.json({ message: "provence can't be empty", success: false, response_code: 201 })
        if (!city)
            return res.json({ message: "city can't be empty", success: false, response_code: 201 })
        if (!phone_number)
            return res.json({ message: "phone_number can't be empty", success: false, response_code: 201 })

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
        address.length == 0
            ? res.status(200).json({ data: address, message: "Address not found!", response_code: 201, success: true, })
            : res.status(200).json({ data: address, message: "Address found", response_code: 200, success: true, })
    } catch (error) {
        // return res.json({ message: error.message, success: false, response_code: 201, })
        return res.json({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201, })
    }
}
const update_Address = async (req, res) => {
    try {
        const userID = req.userId;
        const address_id = req.params.address_id

        const user_address = await addressSchema.aggregate([
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
        let address = await addressSchema.findById(address_id)

        if (user_address.length > 0 && address) {
            const newAddress = {};

            const { name, address_line_1, address_line_2, provence, city, phone_number } = req.body

            if (name)
                newAddress.name = name
            if (address_line_1)
                newAddress.address_line_1 = address_line_1
            if (address_line_2)
                newAddress.address_line_2 = address_line_2
            if (provence)
                newAddress.provence = provence
            if (city)
                newAddress.city = city
            if (phone_number)
                newAddress.phone_number = phone_number

            const address = await addressSchema.findByIdAndUpdate({ _id: address_id, user_id: userID }, { $set: newAddress }, { new: true })

            res.status(200).json({ data: address, message: "Address found", response_code: 200, success: true, })
        }
        else
            res.status(200).json({ message: "Address not found!", response_code: 201, success: true, })
    } catch (error) {
        console.log("🚀 ~ file: address.controller.js:116 ~ constupdate_Address= ~ error.message:", error.message)
        return res.json({ message: error.message, success: false, response_code: 201, })
        // return res.json({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201, })
    }
}
const delete_Address = async (req, res) => {
    try {
        const user_id = req.userId;
        const address_id = req.params.address_id

        // const address = await addressSchema.findById({ userID: userID });
        let data = await addressSchema.aggregate([
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
                    'user._id': new ObjectId(user_id)
                }
            }
        ])
        // console.log("🚀 ~ file: address.controller.js:120 ~ constdelete_Address= ~ data:", data.find(itm => itm.id))
        let address = await addressSchema.findById(address_id)
        if (data.length > 0 && address) {
            const address = await addressSchema.deleteOne({
                _id: new ObjectId(address_id), // Match the address document ID
                user_id: new ObjectId(user_id)
            })
            res.status(200).json({ message: "Address Deleted Successfully!", response_code: 200, success: true, })
        }
        else
            res.status(200).json({ message: "Address not found", response_code: 201, success: true, })
    } catch (error) {
        return res.json({ message: error.message, success: false, response_code: 201, })
        // return res.json({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201, })
    }
}

module.exports = {
    add_address, get_Address, delete_Address, update_Address
}