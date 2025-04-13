import {apiGet, apiPost, baseUrl} from "../../client/BaseClient.ts";
import {
    EditSearchAvailableBoatsRequest,
    SearchAvailableBoatsRequest
} from "../../models/request/SearchAvailableBoatsRequest.ts";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import {MessagesEnum} from "../../utils/MessagesEnum.ts";
import {AxiosError} from "axios";
import {ErrorResponse} from "../../models/response/ErrorResponse.ts";
import {parseLocalToUtc} from "../../utils/DatetimeUtil.ts";

class BoatService {


    static getBoatList = `${baseUrl}/boats/list`;
    static getAvailableBoats = `${baseUrl}/boats/search-available-boats`;
    static getEditAvailableBoats = `${baseUrl}/boats/edit-search-available-boats`;
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

            // convertiamo le date assumendo che da Europe/Rome (formato inserito dall'utente ) vengano parsate in UTC.
            console.log("Pre UTC")
            console.log(request.start_date)
            console.log(request.end_date)
            request.start_date = parseLocalToUtc(request.start_date)
            request.end_date = parseLocalToUtc(request.end_date)
            console.log("Post UTC")
            console.log(request.start_date)
            console.log(request.end_date)
            return await apiPost<BoatResponse, SearchAvailableBoatsRequest>(BoatService.getAvailableBoats, request)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }

    static async editSearchAvailableBoats(request: EditSearchAvailableBoatsRequest): Promise<BoatResponse> {
        try {
            console.log("Pre UTC")
            console.log(request.start_date)
            console.log(request.end_date)
            request.start_date = parseLocalToUtc(request.start_date)
            request.end_date = parseLocalToUtc(request.end_date)
            console.log("Post UTC")
            console.log(request.start_date)
            console.log(request.end_date)
            return await apiPost<BoatResponse, EditSearchAvailableBoatsRequest>(BoatService.getEditAvailableBoats, request)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }
}
export default BoatService;