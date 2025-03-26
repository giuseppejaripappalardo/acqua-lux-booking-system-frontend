import * as React from "react";
import {JSX, useEffect} from "react";
import useAuth from "../../hooks/useAuth.ts";
import {Navigate, useLocation} from "react-router-dom";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}): JSX.Element => {
    const{isAuthenticated} = useAuth();
    const location = useLocation();

    useEffect( () => {
        if(!isAuthenticated) {
            console.log('facciamo redirect')
        }
    }, [isAuthenticated])

    if(!isAuthenticated && location.pathname !== "/Login") {
        return <Navigate to="/login" replace state={{from: location}}/>
    }

    return children
}

export default ProtectedRoute;