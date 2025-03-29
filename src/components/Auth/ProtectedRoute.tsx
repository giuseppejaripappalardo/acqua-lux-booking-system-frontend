import * as React from "react";
import {JSX, useEffect} from "react";
import useAuth from "../../hooks/useAuth.ts";
import {Navigate, useLocation} from "react-router-dom";
import Spinner from "../Layout/Spinner.tsx";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}): JSX.Element => {
    const {isAuthenticated, checkIsAuthenticated, isLoading} = useAuth();
    const location = useLocation();
    const PUBLIC_ROUTES = ["/login"]

    useEffect(() => {
        if (!isLoading) {
            checkIsAuthenticated();
        }
    }, [location.pathname]);


    if (isLoading) {
        return <Spinner/>
    }

    if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname.toLowerCase()) && !isLoading) {
        return <Navigate to="/login" replace state={{from: location}}/>
    }

    return children
}
export default ProtectedRoute;
