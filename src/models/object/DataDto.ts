import {User} from "./AuthState.ts";

export interface dataDTO {
    jwt_token: string
    user: User
}