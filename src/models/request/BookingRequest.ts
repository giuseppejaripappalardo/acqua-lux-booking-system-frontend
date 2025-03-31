import {BookingPaymentMethods} from "../object/Bookings.ts";

export interface BookingRequest {
    seat: number;
    start_date: string;
    end_date: string;
    boat_id: number;
    notes: string;
    payment_method: BookingPaymentMethods
}


export interface ViewBooking {
    booking_id: number
}

export interface EditBookingRequest extends BookingRequest{
    booking_id: number;
}