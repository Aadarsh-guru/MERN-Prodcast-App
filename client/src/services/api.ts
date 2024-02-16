import axios from "axios";

export const baseUrl = `${import.meta.env.VITE_API_URL as string || window.location.origin}/api/v1`;

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true
});


api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest && !error.config.isRetry) {
        originalRequest.isRetry = true;
        try {
            const { data } = await axios.post(`${baseUrl}/auth/refresh-token`, { refreshToken: null }, {
                withCredentials: true
            });
            if (data?.success) {
                return api.request(originalRequest);
            }
        } catch (error) {
            console.log(error);
            return error;
        };
    } else {
        throw error;
    }
});


export default api;