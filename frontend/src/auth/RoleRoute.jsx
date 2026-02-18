import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RoleRoute({ roles }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (!roles.includes(user.rol)) {
        return (
            <Navigate
                to="/no-autorizado"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}
