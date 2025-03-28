import {dataDTO} from "../object/DataDto.ts";


export interface LoginResponse {
    success: boolean;
    message: string;
    data: dataDTO
}