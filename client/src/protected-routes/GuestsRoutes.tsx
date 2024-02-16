import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";

const GuestsRoutes: React.FC = () => {

    const navigate = useNavigate();
    const { isAuth, user } = useSelector((state: RootState) => state.auth);

    React.useEffect(() => {
        if (isAuth && user?.activated) {
            return navigate("/rooms");
        } else if (isAuth && !user?.activated) {
            return navigate("/activate");
        }
    }, [navigate, isAuth, user?.activated]);

    return (
        <Outlet />
    );
};

export default GuestsRoutes;