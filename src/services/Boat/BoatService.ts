import {apiGet, apiPost, baseUrl} from "../../client/BaseClient.ts";
import {SearchAvailableBoatsRequest} from "../../models/request/SearchAvailableBoatsRequest.ts";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import {MessagesEnum} from "../../utils/MessagesEnum.ts";
import {AxiosError} from "axios";
import {ErrorResponse} from "../../models/response/ErrorResponse.ts";

class BoatService {


    static getBoatList = `${baseUrl}/boats/list`;
    static getAvailableBoats = `${baseUrl}/boats/search_available_boats`;
    static async getList(): Promise<BoatResponse> {
        try {
            return await apiGet<BoatResponse>(BoatService.getBoatList)
        } catch (ex) {
            const error = ex as AxiosError;
            throw new Error(error.message || MessagesEnum.GENERIC_ERROR);
        }
    }

    static async searchAvailableBoats(request: SearchAvailableBoatsRequest): Promise<BoatResponse> {
        try {
            return await apiPost<BoatResponse, SearchAvailableBoatsRequest>(BoatService.getAvailableBoats, request)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }
}
export default BoatService;