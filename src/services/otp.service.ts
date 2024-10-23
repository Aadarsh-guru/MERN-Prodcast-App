import crypto from 'crypto';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { otpTemplate } from '../constants/mail.templates';

// Initialize the SES client
const sesClient = new SESClient({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
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
            const params = {
                Destination: {
                    ToAddresses: [to],
                },
                Message: {
                    Body: {
                        Html: {
                            Data: otpTemplate(otp),
                        },
                    },
                    Subject: { Data: 'Verify Your email.' },
                },
                Source: process.env.ADMIN_EMAIL_ADDRESS as string,
            };
            const command = new SendEmailCommand(params);
            return await sesClient.send(command);
        } catch (error) {
            throw error;
        }
    };

    public async verifyOTP(data: string, hashedOTP: string,) {
        return hashedOTP === await this.hashOTP(data);
    };

};


export default new OTPService();