import api from "./api";

const sendOtp = async (data: any) => {
    try {
        return await api.post(`/auth/send-otp`, data);
    } catch (error) {
        throw error;
    }
};

const verifyOtp = async (data: any) => {
    try {
        return await api.post(`/auth/verify-otp`, data);
    } catch (error) {
        throw error;
    }
};

const activateAccount = async (data: FormData) => {
    try {
        return await api.patch(`/auth/activate-account`, data);
    } catch (error) {
        throw error;
    }
};

const logoutUser = async () => {
    try {
        return await api.post(`/auth/logout`,);
    } catch (error) {
        throw error;
    }
};

export {
    sendOtp,
    verifyOtp,
    activateAccount,
    logoutUser,
};