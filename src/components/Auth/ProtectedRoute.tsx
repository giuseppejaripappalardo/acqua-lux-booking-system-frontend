import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import Spinner from "../Layout/Spinner.tsx";
import AuthService from "../../services/Auth/AuthService.ts";
import {useAtom} from "jotai";
import {authAtom} from "../../store/auth.ts";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const [authState, setAuthState] = useAtom(authAtom);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const location = useLocation();
    const PUBLIC_ROUTES = ["/login"];
    // controlliamo se stiamo visitando una route che dovrebbe essere accessibile pubblicamente.
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname.toLowerCase());


    useEffect(() => {
        let isMounted = true;

        // Se la route è public oppure simao autenticati, skippiamo i controlli.
        if (isPublicRoute || authState.isAuthenticated) {
            setIsCheckingAuth(false);
            return;
        }

        /**
         * Chiamo getToken che controlla se il cookie ha un jwt valido.
         * Se lo ha lo settiamo nello state globale su Jotai, cosi da renderlo
         * accessibile all'intera applicazione. Altrimenti settiamo tutto a false.
         * I controlli successivi penseranno a fare il resto del lavoro e rimandare
         * l'utente alla login, oppure consentire la visualizzazione.
         */
        AuthService.getToken()
            .then((result) => {
                if (isMounted && result.data) {
                    setAuthState({
                        isAuthenticated: true,
                        jwt: result.data.jwt_token,
                        user: result.data.user
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) {
                    setAuthState({
                        isAuthenticated: false,
                        jwt: null,
                        user: null
                    });
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsCheckingAuth(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    if (isCheckingAuth) {
        return <Spinner/>;
    }

    /**
     * Di fatto qui il controllo implica questo:
     * 1) Non sono autenticato?
     * 2) Non sto visualizzando una route pubblica?
     * Se entrambe le condizioni sono vere allora l'utente deve essere rimandato alla LOGIN
     */
    if (!authState.isAuthenticated && !isPublicRoute) {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    /**
     * Se tutti i controlli sopra vengono superati
     * Allora significa che l'utente può vedere le pagine protette.
     */
    return children;
};
export default ProtectedRoute;
