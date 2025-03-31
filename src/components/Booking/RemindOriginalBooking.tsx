import BookingCard from "./BookingCard.tsx";
import {BookingWithBoat} from "../../models/response/BookingResponse.ts";
import * as React from "react";

interface RemindOriginalBookingProps {
    booking?: BookingWithBoat | null;
    showActions?: boolean;
    isEditMode?: boolean;
}

const RemindOriginalBooking: React.FC<RemindOriginalBookingProps> = ({booking = null, showActions = false, isEditMode = false}) => {
    if (!booking) return null;
    return (
        <div className="border border-[#D4AF37]/30 rounded-xl p-4 bg-white/70 shadow-sm mb-6 w-full mx-auto px-4">
            <h3 className="text-sm font-semibold text-[#0A1F44] mb-2">
                🔁 Stai modificando la seguente prenotazione
            </h3>
            <BookingCard booking={booking} showActions={showActions} showIsEditMode={isEditMode}/>
        </div>
    );
};

export default RemindOriginalBooking;