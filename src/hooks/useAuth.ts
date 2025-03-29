import {authAtom} from "../store/auth.ts";
import {useAtom} from "jotai";
import {AuthState} from "../models/object/AuthState.ts";
import {useState} from "react";
import AuthService from "../services/Auth/AuthService.ts";
import {LoginResponse} from "../models/response/AuthResponse.ts";
import {LoginRequest} from "../models/request/AuthRequest.ts";
import {MessagesEnum} from "../utils/MessagesEnum.ts";

interface useAuthResult {
    login: (data: LoginRequest) => void;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;
    isLoading: boolean;
    errorMessage: string;
    submitDisabled: boolean;
    setSubmitDisabled: (value: boolean) => void;
    checkIsAuthenticated: () => void;
}

const useAuth = (): useAuthResult => {
    const [auth, setAuth] = useAtom<AuthState>(authAtom)
    const [errorMessage, setErrorMessge] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

    const checkIsAuthenticated = async () => {
        // Anche sul check dobbiamo resettare gli status.
        setIsLoading(true);
        setErrorMessge("");
        try {
            /**
             * Chiedo al backend se ha un cookie con un jwt valido
             * Se è scaduto non ci sarà il cookie e quindi non siamo autenticati.
             * Se il jwt è scaduto il backend non validerà il jwt nel cookie
             * In entrambi i casi finiremmo nel blocco catch e a quel punto dobbiamo
             * rimandare l'utente alla login.
             */
            const response = await AuthService.getToken()

            // Se il nostro controllo va a buon fine settiamo nuovamente lo state opportunamente.
            setAuth({
                isAuthenticated: true,
                jwt: response.data.jwt_token,
                user: response.data.user
            });
        } catch (ex) {
            /**
             * Se siamo qui è perchè non abbiamo il cookie, oppure non è scaduto o il jwt non è più valido.
             * Procediamo settando lo state come non autenticati.
             */
            console.log(ex)
            await logout()
        } finally {
            setIsLoading(false);
        }
    }

    const login = async (auth: LoginRequest) => {

        // Resetto gli state interni, che verranno esposti.
        setIsLoading(true);
        setErrorMessge("");
        setSubmitDisabled(true);

        try {
            // Provo a chiamare il metodo di login
            const response: LoginResponse = await AuthService.login(auth)
            // a questo punto se è andato a buon fine setto qui lo state sullo state manager Jotai.
            setAuth({
                isAuthenticated: true,
                jwt: response.data.jwt_token,
                user: response.data.user
            });
        } catch (ex: unknown) {
            // se invece qualcosa va storto settiamo lo state per fornire un feedback visito dell'errore all'utente.
            if (ex instanceof Error) {
                setErrorMessge(ex.message || MessagesEnum.GENERIC_ERROR);
            } else {
                setErrorMessge(MessagesEnum.GENERIC_ERROR)
            }
            setIsLoading(false);
        } finally {
            setSubmitDisabled(false);
        }
    }

    /**
     * Metodo di utility per effettuare il logout
     */
    const logout = async () => {
        try {
            // Chiamo logout.
            await AuthService.logout()
        } catch (ex: unknown) {
            if (ex instanceof Error) {
                setErrorMessge(ex.message || MessagesEnum.GENERIC_ERROR);
            } else {
                setErrorMessge(MessagesEnum.GENERIC_ERROR)
            }
            setIsLoading(false);
        } finally {
            setSubmitDisabled(false);
        }
        setAuth({
            isAuthenticated: false,
            jwt: null,
            user: null
        });
    }

    const isAuthenticated = auth.isAuthenticated;
    const hasRole = (role: string) => {
        return role === auth.user?.role?.name;
    }

    return {
        login,
        logout,
        isAuthenticated,
        hasRole,
        isLoading,
        submitDisabled,
        setSubmitDisabled,
        errorMessage,
        checkIsAuthenticated
    }
}

export default useAuth;