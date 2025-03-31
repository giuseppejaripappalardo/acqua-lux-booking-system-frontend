export type BookingFlowSteps = "search" | "payment" | "confirm";
export type BookingPaymentMethods = "BANK_TRANSFER" | "CASH" | "CREDIT_CARD";

export interface BookingSearchFields {
    startDate: string;
    endDate: string;
    seats: number;
    isEditMode?: boolean
}