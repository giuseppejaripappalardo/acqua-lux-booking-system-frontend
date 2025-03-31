import * as React from "react";
import {useEffect, useState} from "react";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage";
import {BookingPaymentMethods} from "../../models/object/Bookings";
import {BOOKING_PAYMENT_METHODS, BOOKING_STEPS} from "../../utils/Constants.ts";
import {BookingRequest, EditBookingRequest} from "../../models/request/BookingRequest.ts";
import BookingService from "../../services/Booking/BookingService.ts";
import {AxiosError} from "axios";
import {BookingViewResponse} from "../../models/response/BookingResponse.ts";

interface BookingFlowPaymentStepProps {
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
    flowState: BookingFlowState;
}

const BookingFlowPaymentStep: React.FC<BookingFlowPaymentStepProps> = ({setFlowState, flowState}) => {
    const [loading, setLoading] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const submitEdit = async () => {
        const bookingRequest: EditBookingRequest = {
            booking_id: flowState.originalBooking!.id,
            start_date: flowState.startDate,
            end_date: flowState.endDate,
            seat: flowState.seats,
            notes: flowState.notes,
            payment_method: flowState.paymentMethod,
            boat_id: flowState.selectedBoat!.id
        }
        return await BookingService.editBooking(bookingRequest)
    }

    const submitRequest = async (): Promise<BookingViewResponse> => {
        if (!flowState.selectedBoat) {
            setFlowState(prevState => ({
                    ...prevState,
                    modalErrorMsg: "Si è verificato un errore imprevisto. Si prega di riprovare.",
                    showErrorModal: true,
                })
            );
        }
        const bookingRequest: BookingRequest = {
            start_date: flowState.startDate,
            end_date: flowState.endDate,
            seat: flowState.seats,
            notes: flowState.notes,
            payment_method: flowState.paymentMethod,
            boat_id: flowState.selectedBoat!.id
        }
        return await BookingService.addBooking(bookingRequest)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(flowState.selectedBoat)
        console.log(flowState.originalBooking)
        if (!flowState.selectedBoat && !flowState.originalBooking) {
            console.log("entro qui!")
            setFlowState(prevState => ({
                    ...prevState,
                    modalErrorMsg: "Si è verificato un errore imprevisto. Si prega di riprovare.",
                    showErrorModal: true,
                })
            );
            return;
        }

        let response: BookingViewResponse;

        try {
            setLoading(true);


            if (flowState.isEditMode) {
                console.log('Modifichiamo prenotazione.');
                response = await submitEdit()
            } else {
                console.log('Effettuiamo prenotazione.');
                response = await submitRequest()
            }

            setFlowState(prevState => ({
                ...prevState,
                booking: response.data,
                step: BOOKING_STEPS.confirm
            }));

        } catch (err) {
            const error = err as AxiosError;
            setFlowState(prevState => ({
                ...prevState,
                modalErrorMsg: error.message,
                showErrorModal: true,
            }))
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (flowState.paymentMethod in BOOKING_PAYMENT_METHODS) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [flowState.paymentMethod]);

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
                    className="bg-[#D4AF37] hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-medium transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    disabled={loading || isSubmitDisabled}
                >
                    {loading ? "Prenotazione in corso..." : "Conferma prenotazione"}
                </button>
            </div>
        </form>
    );
};

export default BookingFlowPaymentStep;