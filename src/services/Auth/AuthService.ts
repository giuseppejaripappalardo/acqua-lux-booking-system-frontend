import {LoginRequest} from "../../models/request/AuthRequest.ts";
import {apiPost, baseUrl} from "../../client/BaseClient.ts";
import {LoginResponse} from "../../models/response/AuthResponse.ts";

class AuthService {


    static loginUrl = `${baseUrl}/auth/login`;

    static async login(requestData: LoginRequest): Promise<LoginResponse> {

        try {
            return await apiPost<LoginResponse, LoginRequest>(AuthService.loginUrl, requestData)
        } catch (ex) {
            console.log(ex)
        }
    }

}

export default AuthService;