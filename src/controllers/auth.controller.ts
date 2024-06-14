import { Request, Response } from 'express';
import otpService from '../services/otp.service';
import userService from '../services/user.service';
import authService from '../services/auth.service';
import mediaService from '../services/media.service';

// created a class for handling all auth controllers
class AuthController {

    // send OTP Controller.
    public async sentOtp(request: Request, response: Response) {
        try {
            const { email } = request.body;
            if (!email) {
                return response.status(400).json({
                    success: false,
                    message: 'Email is required.'
                });
            }
            const otp = otpService.generateOTP();
            const expires = Date.now() + 1000 * 60 * 5; // 5 min
            const data = `${email}.${otp}.${expires}`
            const hashedOtp = await otpService.hashOTP(data);
            await otpService.sendOTP(email, otp);
            return response.status(200).json({
                message: 'OTP sent successfully',
                success: true,
                hash: `${hashedOtp}.${expires}`,
                email,
            });
        } catch (error: any) {
            return response.status(500).json({
                message: error.message,
                success: false,
            });
        }
    };

    // verify OTP Controller.
    public async verifyOtp(request: Request, response: Response) {
        try {
            const { hash, otp, email } = request.body;
            if (!hash || !otp || !email) {
                return response.status(400).json({
                    success: false,
                    message: 'OTP hash and otp and phone number are required.'
                });
            }
            const [hashedOtp, expires] = hash.split('.');
            if (Date.now() > parseInt(expires)) {
                return response.status(400).json({
                    success: false,
                    message: 'OTP has expired.'
                });
            }
            const data = `${email}.${otp}.${expires}`
            const isValid = await otpService.verifyOTP(data, hashedOtp);
            if (!isValid) {
                return response.status(400).json({
                    success: false,
                    message: 'Invalid OTP.'
                });
            }
            let user = await userService.findUser({ email });
            if (!user) {
                user = await userService.createUser({ email });
            }
            const { accessToken, refreshToken } = await authService.generateTokens({ id: user._id });
            user.refreshToken = refreshToken;
            await user.save();
            response.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });
            response.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });
            return response.status(200).json({
                user: {
                    id: user?._id,
                    email: user?.email,
                    name: user?.name,
                    avatar: user?.avatar,
                    activated: user?.activated,
                    createdAt: user?.createdAt,
                },
                accessToken,
                refreshToken,
                success: true,
                message: 'OTP verified successfully',
            });
        } catch (error: any) {
            console.log(error);
            return response.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // activate user account controller.
    public async activateAccount(request: Request, response: Response) {
        try {
            const { name } = request.body;
            const file = request.file;
            if (!name) {
                return response.status(400).json({
                    success: false,
                    message: 'Name is required',
                });
            };
            if (file?.size! > 1000000) {
                return response.status(400).json({
                    success: false,
                    message: 'File size must be less than 1MB',
                });
            }
            let fileName;
            if (file) {
                fileName = await mediaService.uploadFile(file);
            }
            const user = await userService.activateUser({
                // @ts-expect-error
                userId: request.userId,
                name,
                avatar: fileName ? fileName : null
            });
            return response.status(200).json({
                user: {
                    id: user?._id,
                    email: user?.email,
                    name: user?.name,
                    avatar: user?.avatar,
                    activated: user?.activated,
                    createdAt: user?.createdAt,
                },
                success: true,
                message: 'Account activated successfully',
            });
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    // refresh access token controller.
    public async refreshToken(request: Request, response: Response) {
        try {
            const refreshToken = request.cookies?.refreshToken || request.body.refreshToken;
            if (!refreshToken) {
                return response.status(401).json({
                    success: false,
                    message: 'Unauthorized.',
                });
            };
            const userData = await authService.verifyRefreshToken(refreshToken);
            if (!userData) {
                return response.status(401).json({
                    success: false,
                    message: 'Please provide a valid refreshToken to continue.'
                });
            }
            // @ts-expect-error
            const userId = userData.id;
            const user = await userService.findUser({ _id: userId });
            if (!user) {
                return response.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            };
            if (user?.refreshToken !== refreshToken) {
                return response.status(401).json({
                    success: false,
                    message: 'Invalid refreshToken',
                });
            }
            const { accessToken, refreshToken: newRefreshToken } = await authService.generateTokens({ id: userId });
            user.refreshToken = newRefreshToken;
            await user.save();
            response.cookie('refreshToken', newRefreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });
            response.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });
            return response.status(200).json({
                accessToken,
                refreshToken,
                user: {
                    id: user?._id,
                    email: user?.email,
                    name: user?.name,
                    avatar: user?.avatar,
                    activated: user?.activated,
                    createdAt: user?.createdAt,
                },
                success: true,
                message: 'Token refreshed successfully',
            });
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    public async logout(request: Request, response: Response) {
        try {
            // @ts-expect-error
            const userId = await request.userId
            await authService.logoutUser(userId);
            response.clearCookie('refreshToken');
            response.clearCookie('accessToken');
            response.status(200).json({
                success: true,
                message: 'Logout successfully',
            });
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

};

export default new AuthController();
