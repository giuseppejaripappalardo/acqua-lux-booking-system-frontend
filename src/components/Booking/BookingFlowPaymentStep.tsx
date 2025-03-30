import * as React from "react";
import {useState} from "react";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage";
import {BookingPaymentMethods} from "../../models/object/Bookings";
import {BOOKING_PAYMENT_METHODS} from "../../utils/Constants.ts";

interface BookingFlowPaymentStepProps {
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
}

const BookingFlowPaymentStep: React.FC<BookingFlowPaymentStepProps> = ({setFlowState}) => {
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<BookingPaymentMethods>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!flowState.selectedBoat) return;
    //
    //     const payload = {
    //         seat: seats,
    //         start_date: DateTime.fromFormat(startDate, "yyyy-MM-dd HH:mm").toISO(),
    //         end_date: DateTime.fromFormat(endDate, "yyyy-MM-dd HH:mm").toISO(),
    //         boat_id: flowState.selectedBoat.id,
    //         notes,
    //         payment_method: paymentMethod
    //     };
    //
    //     try {
    //         setLoading(true);
    //         setError(null);
    //         // await BookingService.createBooking(payload); // da implementare
    //         setFlowState({...flowState, step: "confirm"});
    //     } catch (err) {
    //         setError("Errore durante la prenotazione. Riprova.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <form className="space-y-6 pt-4">
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Note aggiuntive
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Note o richieste extra."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Metodo di pagamento
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as BookingPaymentMethods)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                    <option value="">Seleziona un metodo</option>
                    <option value={BOOKING_PAYMENT_METHODS.BANK_TRANSFER}>Bonifico bancario</option>
                    <option value={BOOKING_PAYMENT_METHODS.CASH}>Contanti</option>
                    <option value={BOOKING_PAYMENT_METHODS.CREDIT_CARD}>Carta di credito</option>
                </select>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-medium transition"
                    disabled={loading}
                >
                    {loading ? "Prenotazione in corso..." : "Conferma prenotazione"}
                </button>
            </div>
        </form>
    );
};

export default BookingFlowPaymentStep;