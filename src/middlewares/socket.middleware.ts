import cookie from 'cookie';
import { Socket, } from 'socket.io';
import authService from '../services/auth.service';

const socketMiddleware = async (socket: Socket, next: any) => {
    try {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        let accessToken = cookies?.accessToken;
        if (!accessToken) {
            accessToken = socket.handshake.auth?.accessToken;
        }
        if (!accessToken) {
            return new Error("Unauthorized: Missing access token");
        }
        const userData = await authService.verifyAccessToken(accessToken);
        if (!userData) {
            return new Error('Please provide a valid accessToken to continue.');
        }
        return next();
    } catch (error: any) {
        return new Error(error.message);
    }
};

export default socketMiddleware;