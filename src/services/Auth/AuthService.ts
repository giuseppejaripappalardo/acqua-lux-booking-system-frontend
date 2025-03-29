import {LoginRequest} from "../../models/request/AuthRequest.ts";
import {apiPost, baseUrl} from "../../client/BaseClient.ts";
import {LoginResponse} from "../../models/response/AuthResponse.ts";
import {AxiosError} from "axios";
import {BaseResponse} from "../../models/response/BaseResponse.ts";

class AuthService {


    static loginUrl = `${baseUrl}/auth/login`;
    static getTokenUrl = `${baseUrl}/auth/get_token`;
    static getLogoutUrl = `${baseUrl}/auth/logout`;

    static async login(requestData: LoginRequest): Promise<LoginResponse> {

        try {
            return await apiPost<LoginResponse, LoginRequest>(AuthService.loginUrl, requestData)
        } catch (ex: unknown) {
            const error = ex as AxiosError;
            if (error.response?.status === 401) {
                throw new Error('Username o password non validi.');
            }

            throw new Error('Si è verificato un errore durante il login. Riprova più tardi.');
        }
    }

    static async getToken(): Promise<LoginResponse> {

        try {
            return await apiPost<LoginResponse>(AuthService.getTokenUrl)
        } catch (ex: unknown) {
            const error = ex as AxiosError;
            if (error.response?.status === 401) {
                throw new Error('Token scaduto o non valido.');
            }

            throw new Error('Si è verificato un errore durante il login. Riprova più tardi.');
        }
    }

    static async logout(): Promise<BaseResponse> {

        try {
            return await apiPost<LoginResponse>(AuthService.getLogoutUrl)
        } catch (ex: unknown) {
            const error = ex as AxiosError;
            if (error.response?.status === 401) {
                throw new Error('Utente non autenticato. Logout non necessario.');
            }

            throw new Error('Si è verificato un errore durante il login. Riprova più tardi.');
        }
    }

}

export default AuthService;