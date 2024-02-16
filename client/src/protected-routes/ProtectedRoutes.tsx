import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from '../store/store'

const ProtectedRoutes: React.FC = () => {

    const navigate = useNavigate();
    const { isAuth, user } = useSelector((state: RootState) => state.auth);

    React.useEffect(() => {
        if (!isAuth) {
            return navigate('/');
        } else if (isAuth && !user?.activated) {
            return navigate('/activate');
        }
    }, [navigate, isAuth, user?.activated]);

    return (
        <Outlet />
    );
};

export default ProtectedRoutes;