import axios from 'axios';
import React from 'react';
import { baseUrl } from '../services/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function useRefreshLoading() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post(`${baseUrl}/auth/refresh-token`, { refreshToken: null }, {
                    withCredentials: true
                });
                if (data?.success) {
                    return dispatch(setAuth(data));
                }
            } catch (error: any) {
                return navigate('/');
            } finally {
                setLoading(false);
            };
        })();
    }, []);

    return loading;
};