import * as React from "react";
import {useState} from "react";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage";
import {BookingPaymentMethods} from "../../models/object/Bookings";
import {BOOKING_PAYMENT_METHODS, BOOKING_STEPS} from "../../utils/Constants.ts";
import {BookingRequest} from "../../models/request/BookingRequest.ts";
import BookingService from "../../services/Booking/BookingService.ts";
import {AxiosError} from "axios";

interface BookingFlowPaymentStepProps {
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
    flowState: BookingFlowState;
}

const BookingFlowPaymentStep: React.FC<BookingFlowPaymentStepProps> = ({setFlowState, flowState}) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (!flowState.selectedBoat) return;

            const bookingRequest: BookingRequest = {
                start_date: flowState.startDate,
                end_date: flowState.endDate,
                seat: flowState.seats,
                notes: flowState.notes,
                payment_method: flowState.paymentMethod,
                boat_id: flowState.selectedBoat?.id
            }
            const response = await BookingService.addBooking(bookingRequest)

            setFlowState(prevState => ({
                ...prevState,
                booking: response,
                step: BOOKING_STEPS.confirm
            }))

        } catch (err) {
            const error = err as AxiosError;
            setFlowState(prevState => ({
                ...prevState,
                errorMsg: error.message,
                showError: true,
            }))
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Note aggiuntive
                </label>
                <textarea
                    value={flowState.notes}
                    onChange={(e) => setFlowState(prevState => ({
                            ...prevState,
                            notes: e.target.value,
                        })
                    )}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Note o richieste extra."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Metodo di pagamento
                </label>
                <select
                    value={flowState.paymentMethod}
                    onChange={(e) => setFlowState(prevState => ({
                            ...prevState,
                            paymentMethod: e.target.value as BookingPaymentMethods,
                        })
                    )}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                    <option value="">Seleziona un metodo</option>
                    <option value={BOOKING_PAYMENT_METHODS.BANK_TRANSFER}>Bonifico bancario</option>
                    <option value={BOOKING_PAYMENT_METHODS.CASH}>Contanti</option>
                    <option value={BOOKING_PAYMENT_METHODS.CREDIT_CARD}>Carta di credito</option>
                </select>
            </div>

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