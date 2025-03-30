import {BookingFlowSteps, BookingPaymentMethods} from "../models/object/Bookings.ts";

export const BOOKING_STEPS: Record<BookingFlowSteps, BookingFlowSteps> = {
    search: "search",
    payment: "payment",
    confirm: "confirm",
} as const;

export const BOOKING_PAYMENT_METHODS: Record<BookingPaymentMethods, BookingPaymentMethods> = {
    BANK_TRANSFER: "BANK_TRANSFER",
    CASH: "CASH",
    CREDIT_CARD: "CREDIT_CARD",
}

export const BOOKING_METHODS_TRANSLATIONS: Record<BookingPaymentMethods, string> = {
    BANK_TRANSFER: "Bonifico bancario",
    CASH: "Contanti",
    CREDIT_CARD: "Carta di credito",
}