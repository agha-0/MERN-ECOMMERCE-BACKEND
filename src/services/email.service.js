import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
    try {
        console.log(email, "inside email")
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text,
        });
console.log({
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: text,
},"datattattata")
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email. Please try again later.');
    }
};

export default sendEmail;
