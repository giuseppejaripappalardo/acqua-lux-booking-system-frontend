import {authAtom} from "../store/auth.ts";
import {useAtom} from "jotai";
import {AuthState, User} from "../models/object/AuthState.ts";
import {LoginResponse} from "../models/response/AuthResponse.ts";
import {LoginRequest} from "../models/request/AuthRequest.ts";

interface useAuthResult {
    login: (user: LoginRequest) => void;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;
}

const useAuth = (): useAuthResult => {
    const [auth, setAuth] = useAtom<AuthState>(authAtom)

    const login = (auth: LoginResponse) => {
        setAuth({
            isAuthenticated: true,
            jwt: auth.data.jwt_token,
            user: auth.data.user
        });
    }

    const logout = () => {
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
        hasRole
    }
}

export default useAuth;