import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
});


const UserModel = mongoose.model('User', userSchema);
export default UserModel;
