const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema = require('../models/model.user')

const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
const path = require('path');
const fs = require('fs');

const signup = async (req, res) => {
    const username = req.body.username
    const full_name = req.body.full_name
    const email = req.body.email
    const phone_number = req.body.phone_number
    const password = req.body.password
    const profile = req.body.profile

    if (!username || !full_name || !email || !password || !phone_number) {
        return res.json({ message: "Fields can't be empty", success: false, response_code: 201 })
    } else {
        try {
            // Check Existing Email 
            const existingEmail = await userSchema.findOne({ email: email })
            if (existingEmail) return res.json({ message: "Email already Exists", success: false, response_code: 201 })
            let data = req.body

            // Generate Password Hash
            const hashedPassword = await bcrypt.hash(password, 10)
            const result = await userSchema.create({
                username: username,
                full_name: full_name,
                email: email,
                phone_number: phone_number,
                password: hashedPassword,
                profile: profile,
            })
            const token = JWT.sign({ id: result.id }, process.env.JWT_SECRET)

            data = { ...data, token: token }
            console.log(data)

            res.status(201).json({ data: data, message: "Successfully Registered!", response_code: 200, success: true })
        } catch (error) {
            return res.json({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201, })
        }
    }
}

const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    console.log(email, password);
    if (!email || !password) {
        return res.json({ message: "Fields Can't be null", success: false, response_code: 201 })
    }
    else {
        try {
            // Check Existing User and Check match password 
            let existingEmail = await userSchema.findOne({ email: email })
            if (!existingEmail) return res.json({ message: "Invalid Credentials", success: false, response_code: 201 })
            let newEmail = existingEmail;
            const passwordMatch = await bcrypt.compare(password, existingEmail.password)
            if (!passwordMatch) return res.json({ message: "Invalid Credentials", success: false, response_code: 201 })

            // Generate JWT 
            const token = JWT.sign({ id: existingEmail.id }, process.env.JWT_SECRET)
            existingEmail = { ...existingEmail._doc, token: token }


            res.status(201).send({ data: existingEmail, success: true, response_code: 200 })
        } catch (error) {
            res.json({ message: error.message, success: false, response_code: 201 })
        }
    }
}

const getUser = async (req, res) => {
    const userID = req.userId
    const email = req.params.email
    try {
        if (userID) {
            const data = await userSchema.findById(userID)
            res.status(201).send({ data: data, success: true, response_code: 200 })
        } else if (email) {
            const data = await userSchema.find({ email: email })
            if (data.length !== 0)
                res.status(201).send({ data: data, success: true, response_code: 200 })
            else
                res.status(201).send({ data: data, message: "The email address you entered is not registered, Please try again!", success: false, response_code: 201 })
        } else {
            res.status(500).send({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201 })
        }
    } catch (error) {
        res.status(500).send({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201 })
    }
}

const updateUser = async (req, res) => {
    const uID = req.userId
    const u_ID = req.params.id
    const username = req.body.username
    const full_name = req.body.full_name
    const email = req.body.email
    const phone_number = req.body.phone_number
    const password = req.body.password
    // const profile = process.env.BASE_URL + "/" + req.file.path


    let userID;
    if (uID) userID = uID
    if (u_ID) userID = u_ID

    try {
        let hashedPassword
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10)
        }
        const newUser = {};
        console.log(u_ID)
        if (username) { newUser.username = username }
        if (full_name) { newUser.full_name = full_name }
        if (email) { newUser.email = email }
        if (phone_number) { newUser.phone_number = phone_number }
        if (password) { newUser.password = hashedPassword }
        // if (profile) { newUser.profile = profile }

        console.log(newUser)

        const data = await userSchema.findById(userID)

        if (data) {
            user = await userSchema.findByIdAndUpdate(userID, { $set: newUser }, { new: true })

            res.status(201).send({ data: user, success: true, message: "Profile Updated Successfully", response_code: 200 })
        } else {
            res.status(201).send({ message: "User Not Found", response_code: 201 })
        }
    } catch (error) {
        return res.send({ error: error.message, success: false, message: process.env.ERROR_MESSAGE, response_code: 201 })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) res.status(404).send({ message: "Invalid Username or Email ID", success: false, response_code: 201 })
    else {
        try {
            const filePath = path.join(__dirname, '../mail_templates/ResetPassword.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            let code = Math.floor(Math.random() * 900000) + 100000;
            const replacements = { reset_code: code }
            const htmlToSend = template(replacements);
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    service: 'gmail',
                    port: 587,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_ID,
                        pass: process.env.PASSWORD
                    }
                });
                transporter.sendMail({
                    from: process.env.EMAIL_ID,
                    to: email,
                    subject: "Password Reset Request",
                    html: htmlToSend,
                    headers: { 'x-myheader': 'test header' }
                });
                res.status(201).send({ data: { code: code }, message: "Reset code is sent to your email Address!", success: true, response_code: 201 })
            } catch (error) {
                res.status(404).send({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201 })
            }
        } catch (error) {
            console.log({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201 })
        }
    }
}

const emailRegistration = async (req, res) => {
    const { email, username } = req.body
    if (!email || !username) res.status(404).send({ message: "Invalid Username or Email ID", success: false, response_code: 201 })
    else {
        try {
            const filePath = path.join(__dirname, '../mail_templates/Register_User.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            let code = Math.floor(Math.random() * 9000) + 1000;
            const replacements = { opt_code: code, username: username, }

            const htmlToSend = template(replacements);
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    service: 'gmail',
                    port: 587,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_ID,
                        pass: process.env.PASSWORD
                    },
                });
                transporter.sendMail({
                    from: process.env.EMAIL_ID,
                    to: email,
                    subject: "Account Varification Request",
                    attachments: [{
                        filename: 'Logo.png',
                        path: __dirname + '/../mail_templates/Logo.png',
                        cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
                    }],
                    html: htmlToSend,
                    headers: { 'x-myheader': 'test header' }
                });
                res.status(201).send({ data: { code: code }, message: "OTP is sent to your email Address!", success: true, response_code: 200 })
            } catch (error) {
                res.status(404).send({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201 })
            }
        } catch (error) {
            console.log({ message: process.env.ERROR_MESSAGE, success: false, response_code: 201 })
        }
    }
}

module.exports = {
    signup, login, getUser, forgotPassword, updateUser, emailRegistration
}
