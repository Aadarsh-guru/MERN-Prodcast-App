import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";


const SemiProtectedRoutes: React.FC = () => {

    const navigate = useNavigate();
    const { isAuth, user } = useSelector((state: RootState) => state.auth);

    React.useEffect(() => {
        if (!isAuth) {
            return navigate("/");
        } else if (isAuth && user?.activated) {
            return navigate('/rooms');
        }
    }, [navigate, isAuth, user?.activated]);

    return (
        <Outlet />
    );
};

export default SemiProtectedRoutes;