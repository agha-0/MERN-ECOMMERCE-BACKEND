const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Reference to the "User" model
    name: {
        type: String,
        required: [true, "Name Can't be Null"]
    },
    address_line_1: {
        type: String,
        required: [true, "Address Line 1 Can't be Null"]
    },
    address_line_2: {
        type: String,
        // required: [true, "Address Line 2 Can't be Null"]
    },
    provence: {
        type: String,
        required: [true, "provence Can't be Null"]
    },
    city: {
        type: String,
        required: [true, "city Can't be Null"]
    },
    phone_number: {
        type: String,
    }
})


module.exports = mongoose.model('address', addressSchema)