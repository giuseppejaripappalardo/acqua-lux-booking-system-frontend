import {authAtom} from "../state/auth.ts";
import { useAtom } from "jotai";
import {AuthState, User} from "../models/object/AuthState.ts";

interface useAuthResult {
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;
}

const useAuth = (): useAuthResult => {
    const [auth, setAuth] = useAtom<AuthState>(authAtom)

    const login = (user: User) => {
        setAuth({
            isAuthenticated: true,
            user: user
        });
    }

    const logout = () => {
        setAuth({
            isAuthenticated: false,
            user: null
        });
    }

    const isAuthenticated = auth.isAuthenticated;
    const hasRole = (role: string) => {
        return role === auth.user?.role;
    }

    return {
        login,
        logout,
        isAuthenticated,
        hasRole
    }
}

export default useAuth;