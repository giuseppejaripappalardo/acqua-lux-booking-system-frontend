import {apiGet, baseUrl} from "../../client/BaseClient.ts";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import {MessagesEnum} from "../../utils/MessagesEnum.ts";
import {AxiosError} from "axios";

class BoatService {


    static getBoatList = `${baseUrl}/boats/list`;

    static async getList(): Promise<BoatResponse> {
        try {
            return await apiGet<BoatResponse>(BoatService.getBoatList)
        } catch (ex) {
            const error = ex as AxiosError;
            throw new Error(error.message || MessagesEnum.GENERIC_ERROR);
        }
    }
}

export default BoatService;