import * as React from "react";
import {useEffect, useState} from "react";
import BookingFlowSearchStep from "../../components/Booking/BookingFlowSearchStep.tsx";
import {Boat} from "../../models/object/Boat.ts";
import {BookingFlowSteps, BookingPaymentMethods} from "../../models/object/Bookings.ts";
import {BOOKING_STEPS} from "../../utils/Constants.ts";
import BookingFlowPaymentStep from "../../components/Booking/BookingFlowPaymentStep.tsx";
import BookingOverview from "../../components/Booking/BookingOverview.tsx";

export interface BookingFlowState {
    step: BookingFlowSteps;
    selectedBoat: Boat | null;
    startDate: string;
    endDate: string;
    seats: number;
    paymentMethod: BookingPaymentMethods | null;
    firstRunCompleted: boolean;
    searchAttempt: boolean;
}

/**
 * Questo componente serve per orchestrare il flusso di ricerca disponibilità.
 * L'orchestrazione prevede un flusso di ricerca che sfurtta il componente dedicato BookingFlowSearchStep.
 * Nello scenario di ricerca le cards delle imbarcazioni saranno selezionabili, poiché se richiamate dal quel
 * componente riceveranno un flag boolean. Al select questo scatenerà un evento che andrà a settare l'imbarcazione
 * selezionata nello state. A questo punto con uno useEffect restiamo in ascolto del cambio del valore di selectedBoat.
 * Ora se selectedBoat è != null, a quel punto possiamo chiamare il metodo setFlowState che stiamo passando al componente
 * figlio e settare l'imbarcazione selezionata.
 * In questo componente invece lo useEffect ascolta i cambiamenti sul BookingFlowStep. Se viene selezionata una imbarcazione
 * e il valore è !== null allora lo step avanzerà a payment, dove mostriamo un form per procedere con la conferma della prenotazione.
 * Se tutto va a buon fine la prenotazione passerà in stato confermato (a prescindere dal metodo di pagamento, che per gli scopi di questo
 * project work sarà soltanto un mock, anche se il dato viene salvato a DB).
 * Lo step finale è uno step di cortesia che mostra un messaggio di conferma.
 */
const BookingFlowPage: React.FC = () => {


    // Di base iniziamo sempre con lo step Search
    const [bookingFlowState, setBookingFlowState] = useState<BookingFlowState>({
        step: BOOKING_STEPS.search,
        seats: 1,
        selectedBoat: null,
        startDate: "",
        endDate: "",
        paymentMethod: null,
        firstRunCompleted: false,
        searchAttempt: false
    });

    useEffect(() => {
        if (bookingFlowState.step === BOOKING_STEPS.search &&
            bookingFlowState.selectedBoat !== null) {
            setBookingFlowState({
                ...bookingFlowState,
                step: BOOKING_STEPS.payment
            });
        }
    }, [bookingFlowState]);

    return (
        <div className="w-full mx-auto px-4 pt-8 pb-16">
            {bookingFlowState.step === BOOKING_STEPS.search && (
                <BookingFlowSearchStep setFlowState={setBookingFlowState} flowState={bookingFlowState}/>
            )}

            {bookingFlowState.step === BOOKING_STEPS.payment && (
                <div className="mt-6">
                    <div className="w-full bg-white p-6 rounded-xl shadow-xl space-y-6">
                        <h2 className="font-serif text-[#0A1F44] text-3xl font-bold mb-6">
                            Riepilogo prenotazione
                        </h2>
                        <BookingOverview flowStateBoat={bookingFlowState} setFlowState={setBookingFlowState}/>
                        <BookingFlowPaymentStep setFlowState={setBookingFlowState}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingFlowPage;