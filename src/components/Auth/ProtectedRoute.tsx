import * as React from "react";
import {JSX, useEffect} from "react";
import {Navigate, useLocation} from "react-router-dom";
import Spinner from "../Layout/Spinner.tsx";
import useAuth from "../../hooks/useAuth.ts";
import {LOGIN_ROUTE} from "../../pages/Login/LoginPage.tsx";

interface ProtectedRouteProps {
    render: () => JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({render}) => {
    const {handleAuthCheck, isLoading, isAuthenticated} = useAuth();
    const location = useLocation();
    const PUBLIC_ROUTES = [LOGIN_ROUTE];
    // controlliamo se stiamo visitando una route che dovrebbe essere accessibile pubblicamente.
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname.toLowerCase());

    useEffect(() => {
        /**
         * Qui facciamo il controllo sul token al primo mount.
         * Questo si verifica quando facciamo un refresh della pagina.
         * Da notare che se il token scade, anche se questo controllo non
         * viene eseguito, abbiamo l'interceptor che è in ascolto ed in caso
         * l'utente finirebbe in /login per errore 401.
         */
        handleAuthCheck();
    }, [location.pathname]);

    /**
     * Se la verifica è in corso lanciamo lo spinner
     * Per evitare render di componenti o redirect.
     */
    if (isLoading && !isAuthenticated) {
        return <Spinner/>;
    }

    /**
     * Di fatto qui il controllo implica questo:
     * 1) Non sono autenticato?
     * 2) Non sto visualizzando una route pubblica?
     * Se entrambe le condizioni sono vere allora l'utente deve essere rimandato alla LOGIN
     */
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
        return <Navigate to={LOGIN_ROUTE} replace state={{from: location}}/>;
    }

    if (isAuthenticated && location.pathname === LOGIN_ROUTE) {
        console.log('redirect specifico da login');
        return <Navigate to="/" replace/>;
    }

    if (isAuthenticated && !isLoading || isPublicRoute && !isLoading) {
        return render();
    }

    return <Spinner/>;
};
export default ProtectedRoute;
