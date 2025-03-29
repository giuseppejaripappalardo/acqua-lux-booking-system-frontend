import {authAtom} from "../store/auth.ts";
import {useAtom} from "jotai";
import {AuthState, User} from "../models/object/AuthState.ts";
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
    getLoggedUser: () => User | null;
}

const useAuth = (): useAuthResult => {
    const [auth, setAuth] = useAtom<AuthState>(authAtom)
    const [errorMessage, setErrorMessge] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);


    const getLoggedUser = (): User | null => {
        if (!auth.isAuthenticated) {
            return null;
        }
        return auth.user
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
        } finally {
            setSubmitDisabled(false);
            setTimeout(() => {
                setIsLoading(false);
            }, 300)
        }
    }

    /**
     * Metodo di utility per effettuare il logout
     */
    const logout = async () => {
        setIsLoading(true);

        try {
            await AuthService.logout()
        } catch (ex: unknown) {
            if (ex instanceof Error) {
                setErrorMessge(ex.message || MessagesEnum.GENERIC_ERROR);
            } else {
                setErrorMessge(MessagesEnum.GENERIC_ERROR)
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300)
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
        getLoggedUser
    }
}

export default useAuth;