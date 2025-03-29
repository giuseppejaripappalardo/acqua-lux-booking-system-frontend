import * as React from "react";
import {JSX, useEffect, useRef} from "react";
import useAuth from "../../hooks/useAuth.ts";
import {Navigate, useLocation} from "react-router-dom";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}): JSX.Element => {
    const {isAuthenticated, checkIsAuthenticated, isLoading} = useAuth();
    const location = useLocation();
    const authCheckAttempted = useRef(false);


    useEffect(() => {
        if (!isAuthenticated && !authCheckAttempted.current) {
            authCheckAttempted.current = true;
            checkIsAuthenticated();
        }
    }, [checkIsAuthenticated, isAuthenticated]);

    if (isLoading) {
        return <></>
    }

    if (!isAuthenticated && location.pathname !== "/Login" && authCheckAttempted.current) {
        return <Navigate to="/login" replace state={{from: location}}/>
    }

    return children
}

export default ProtectedRoute;