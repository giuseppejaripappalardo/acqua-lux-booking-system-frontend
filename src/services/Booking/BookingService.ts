import {apiGet, apiPost, baseUrl} from "../../client/BaseClient.ts";
import {MessagesEnum} from "../../utils/MessagesEnum.ts";
import {AxiosError} from "axios";
import {
    BookingRequest,
    DeleteBookingRequest,
    EditBookingRequest,
    ViewBooking
} from "../../models/request/BookingRequest.ts";
import {BookingsListResponse, BookingViewResponse} from "../../models/response/BookingResponse.ts";
import {ErrorResponse} from "../../models/response/ErrorResponse.ts";
import {parseLocalToUtc} from "../../utils/DatetimeUtil.ts";

class BookingService {

    static addBookingAction = `${baseUrl}/bookings/add`;
    static editBookingAction = `${baseUrl}/bookings/edit`;
    static getReservationList = `${baseUrl}/bookings/list`;
    static getReservationView = `${baseUrl}/bookings/view`;
    static deleteReservation = `${baseUrl}/bookings/delete`;

    static async addBooking(bookingData: BookingRequest): Promise<BookingViewResponse> {
        try {
            // convertiamo le date assumendo che da Europe/Rome (formato inserito dall'utente ) vengano parsate in UTC.
            console.log("Pre UTC")
            console.log(bookingData.start_date)
            console.log(bookingData.end_date)
            bookingData.start_date = parseLocalToUtc(bookingData.start_date)
            bookingData.end_date = parseLocalToUtc(bookingData.end_date)
            console.log("Post UTC")
            console.log(bookingData.start_date)
            console.log(bookingData.end_date)
            return await apiPost<BookingViewResponse, BookingRequest>(BookingService.addBookingAction, bookingData)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }

    static async editBooking(bookingData: EditBookingRequest): Promise<BookingViewResponse> {
        try {
            // convertiamo le date assumendo che da Europe/Rome (formato inserito dall'utente ) vengano parsate in UTC.
            // convertiamo le date assumendo che da Europe/Rome (formato inserito dall'utente ) vengano parsate in UTC.
            console.log("Pre UTC")
            console.log(bookingData.start_date)
            console.log(bookingData.end_date)
            bookingData.start_date = parseLocalToUtc(bookingData.start_date)
            bookingData.end_date = parseLocalToUtc(bookingData.end_date)
            console.log("Post UTC")
            console.log(bookingData.start_date)
            console.log(bookingData.end_date)
            console.log(bookingData.start_date)
            console.log(bookingData.end_date)

            return await apiPost<BookingViewResponse, EditBookingRequest>(BookingService.editBookingAction, bookingData)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }

    static async getReservation(booking: ViewBooking): Promise<BookingViewResponse> {
        try {
            return await apiGet<BookingViewResponse, ViewBooking>(BookingService.getReservationView, booking)
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

    static async deleteBooking(bookingRequest: DeleteBookingRequest): Promise<BookingViewResponse> {
        try {
            return await apiPost<BookingViewResponse, DeleteBookingRequest>(BookingService.deleteReservation, bookingRequest)
        } catch (ex) {
            const error = ex as AxiosError;
            const errorData = error?.response?.data as ErrorResponse;
            throw new Error(errorData?.message || MessagesEnum.GENERIC_ERROR);
        }
    }
}

export default BookingService;