import {dataDTO} from "../object/DataDto.ts";
import {BaseResponse} from "./BaseResponse.ts";


export interface LoginResponse extends BaseResponse {
    data: dataDTO
}