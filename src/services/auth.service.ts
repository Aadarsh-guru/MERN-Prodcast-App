import jwt from "jsonwebtoken";
import User from "../models/user.model";

class AuthService {

    public async generateTokens(payload: any) {
        try {
            const accessToken = await jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN as string, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string
            });
            const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN as string, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string
            });
            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    };

    public async verifyAccessToken(token: string) {
        try {
            return await jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN as string);
        } catch (error) {
            throw error;
        }
    };

    public async verifyRefreshToken(token: string) {
        try {
            return await jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN as string);
        } catch (error) {
            throw error;
        }
    };

    public async logoutUser(userId: string) {
        try {
            return await User.findByIdAndUpdate(userId, { refreshToken: null }, { new: true });
        } catch (error) {
            throw error;
        }
    };

};

export default new AuthService();