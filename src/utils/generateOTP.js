import User from '../models/user.model.js';

const generateOTP = async () => {
    let otp;
    let otpExists = true;

    do {
        otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpExists = await User.exists({ otp });
    } while (otpExists);

    return otp;
};

export default generateOTP;
