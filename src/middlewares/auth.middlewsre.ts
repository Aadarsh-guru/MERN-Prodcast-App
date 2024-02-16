import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const accessToken = request.cookies?.accessToken || request.headers.authorization?.replace("Bearer ", "");
        if (!accessToken) {
            return response.status(401).json({
                message: 'Please provide a valid accessToken to continue.',
                success: false
            });
        }
        const userData = await authService.verifyAccessToken(accessToken);
        if (!userData) {
            return response.status(401).json({
                success: false,
                message: 'Please provide a valid accessToken to continue.'
            });
        }
        // @ts-expect-error
        request.userId = userData?.id;
        return next();
    } catch (error: any) {
        return response.status(401).json({
            success: false,
            message: error.message,
        });
    }
};


export default authMiddleware;