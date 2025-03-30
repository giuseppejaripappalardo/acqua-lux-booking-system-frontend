import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage.tsx";

export type BookingFlowSteps = "search" | "payment" | "confirm";
export type BookingPaymentMethods = "BANK_TRANSFER" | "CASH" | "CREDIT_CARD";

export type BookingSearchFields = Omit<BookingFlowState, "selectedBoat" | "step" | "paymentMethod">