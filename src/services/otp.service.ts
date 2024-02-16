import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { otpTemplate } from '../constants/mail.templates';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_MAIL_USER_ID as string,
        pass: process.env.GMAIL_MAIL_USER_PASSWORD as string
    },
});

// created an auth service class
class OTPService {

    public generateOTP() {
        return crypto.randomInt(1000, 9999);
    };

    public async hashOTP(data: string) {
        return await crypto.createHmac('sha256', process.env.HASH_SECRET as string).update(data).digest('hex');
    };

    public async sendOTP(to: string, otp: number) {
        try {
            return await transporter.sendMail({
                from: process.env.GMAIL_MAIL_USER_ID as string,
                to,
                subject: 'Verify Your email.',
                html: otpTemplate(otp)
            });
        } catch (error) {
            throw error;
        }
    };

    public async verifyOTP(data: string, hashedOTP: string,) {
        return hashedOTP === await this.hashOTP(data);
    };

};


export default new OTPService();