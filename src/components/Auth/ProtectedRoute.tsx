import * as React from "react";
import {JSX, useEffect} from "react";
import {Navigate, useLocation} from "react-router-dom";
import Spinner from "../Layout/Spinner.tsx";
import useAuth from "../../hooks/useAuth.ts";

interface ProtectedRouteProps {
    render: () => JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({render}) => {
    const {handleAuthCheck, isLoading, isAuthenticated} = useAuth();
    const location = useLocation();
    const LOGIN_ROUTE = "/login";
    const PUBLIC_ROUTES = [LOGIN_ROUTE];
    // controlliamo se stiamo visitando una route che dovrebbe essere accessibile pubblicamente.
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname.toLowerCase());

    useEffect(() => {
        /**
         * Se su jotai risulto autenticato, skippiamo il controllo.
         * Utile comunque che venga fatto il check ad ogni cambio di route
         * Se per X motivo l'auth viene settata a false perchè fallisce una
         * chiamata questo blocco garantisce il redirect.
         */
        if (!isAuthenticated) {
            console.log("facciamo il check");
            handleAuthCheck();
        }
    }, [location.pathname]);

    /**
     * Se la verifica è in corso lanciamo lo spinner
     * Per evitare render di componenti o redirect.
     */
    if (isLoading) {
        return <Spinner/>;
    }

    /**
     * Di fatto qui il controllo implica questo:
     * 1) Non sono autenticato?
     * 2) Non sto visualizzando una route pubblica?
     * Se entrambe le condizioni sono vere allora l'utente deve essere rimandato alla LOGIN
     */
    if (!isAuthenticated && !isPublicRoute) {
        return <Navigate to={LOGIN_ROUTE} replace state={{from: location}}/>;
    }

    if (isAuthenticated && location.pathname === LOGIN_ROUTE) {
        console.log('redirect specifico da login');
        return <Navigate to="/" replace/>;
    }

    if (isAuthenticated || isPublicRoute) {
        return render();
    }

    return <Spinner/>;
};
export default ProtectedRoute;
