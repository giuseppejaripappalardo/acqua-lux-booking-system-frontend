import {apiGet, apiPost, baseUrl} from "../../client/BaseClient.ts";
import {MessagesEnum} from "../../utils/MessagesEnum.ts";
import {AxiosError} from "axios";
import {BookingRequest} from "../../models/request/BookingRequest.ts";
import {BookingResponse, BookingsListResponse} from "../../models/response/BookingResponse.ts";
import {ErrorResponse} from "../../models/response/ErrorResponse.ts";

class BookingService {

    static addBookingAction = `${baseUrl}/bookings/add`;
    static getReservationList = `${baseUrl}/bookings/list`;

    static async addBooking(bookingData: BookingRequest): Promise<BookingResponse> {
        try {
            return await apiPost<BookingResponse, BookingRequest>(BookingService.addBookingAction, bookingData)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }

    static async getReservations(): Promise<BookingsListResponse> {
        try {
            return await apiGet<BookingsListResponse>(BookingService.getReservationList)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }

}

export default BookingService;