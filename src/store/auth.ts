import {atom} from "jotai";
import {AuthState} from "../models/object/AuthState.ts";

export const authAtom = atom<AuthState>({
    isAuthenticated: false,
    jwt: null,
    user: null,
});