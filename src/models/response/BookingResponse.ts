import {BaseResponse} from "./BaseResponse.ts";
import {User} from "../object/AuthState.ts";
import {BookingPaymentMethods} from "../object/Bookings.ts";
import {Boat} from "../object/Boat.ts";
export type ReservationStatuses = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Booking {
    id: number;
    seat: number;
    start_date: string;
    end_date: string;
    boat_id: number;
    customer_id: number;
    notes: string;
    total_price: number;
    reservation_code: string;
    price_difference: string;
    requires_refund: boolean;
    payment_method: BookingPaymentMethods;
    reservation_status: ReservationStatuses;
    created_at: string;
    modified_at: string;
    customer: User
}

export interface BookingResponse extends BaseResponse {
    data: Booking;
}

export interface BookingWithBoat extends Booking{
    boat: Boat;
}


export interface BookingsListResponse extends BaseResponse{
    data: BookingWithBoat[];
}