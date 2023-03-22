const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username Can't be Null"]
    },
    full_name: {
        type: String,
        required: [true, "Username Can't be Null"]
    },
    email: {
        type: String,
        required: [true, "email Can't be Null"]
    },
    phone_number: {
        type: Number,
        required: [true, "mobile Can't be Null"]
    },
    password: {
        type: String,
        required: [true, "password Can't be Null"]
    },
    profile: {
        type: String,
    }
})


module.exports = mongoose.model('user', userSchema)