import {BaseResponse} from "./BaseResponse.ts";
import {User} from "../object/AuthState.ts";

export type ReservationStatuses = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface BookingResponse extends BaseResponse {
    id: number;
    seat: number;
    start_date: string;
    end_date: string;
    boat_id: number;
    customer_id: number;
    notes: string;
    total_price: string;
    reservation_code: string;
    price_difference: string;
    requires_refund: boolean;
    payment_method: PaymentMethodData;
    reservation_status: ReservationStatuses;
    created_at: string;
    modified_at: string;
    customer: User
}