import {LoginRequest} from "../../models/request/AuthRequest.ts";
import {apiPost, baseUrl} from "../../client/BaseClient.ts";
import {LoginResponse} from "../../models/response/AuthResponse.ts";
import {AxiosError} from "axios";

class AuthService {


    static loginUrl = `${baseUrl}/auth/login`;

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

}

export default AuthService;