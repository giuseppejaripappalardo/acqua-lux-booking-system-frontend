import {BaseResponse} from "./BaseResponse.ts";
import {Boat} from "../object/Boat.ts";

export interface BoatResponse extends BaseResponse {
    data: Boat[];
}