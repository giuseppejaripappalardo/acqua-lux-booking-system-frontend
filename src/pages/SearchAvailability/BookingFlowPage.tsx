import * as React from "react";
import {useEffect, useState} from "react";
import BookingFlowSearchStep from "../../components/Booking/BookingFlowSearchStep.tsx";
import {Boat} from "../../models/object/Boat.ts";


type BookingFlowSteps = "search" | "payment" | "confirm";

const BOOKING_STEPS: Record<BookingFlowSteps, BookingFlowSteps> = {
    search: "search",
    payment: "payment",
    confirm: "confirm",
} as const;

export interface BookingFlowState {
    step: BookingFlowSteps;
    selectedBoat: Boat | null;
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
 * ed il valore è !== null allora lo step avanzerà a paymant, dove mostriamo un form per procedere con la conferma della prenotazione.
 * Se tutto va a buon fine la prenotazione passerà in stato confermato (a prescindere dal metodo di pagamento, che per gli scopi di questo
 * project work sarà soltanto un mock, anche se il dato viene salvato a DB).
 * Lo step finale è uno step di cortesia che mostra un messaggio di conferma.
 */
const BookingFlowPage: React.FC = () => {

    // Di base iniziamo sempre con lo step Search
    const [bookingFlowState, setBookingFlowState] = useState<BookingFlowState>({
        step: BOOKING_STEPS.search,
        selectedBoat: null
    });

    useEffect(() => {

        if (bookingFlowState.step === BOOKING_STEPS.search && bookingFlowState.selectedBoat !== null) {
            setBookingFlowState({
                ...bookingFlowState,
                step: BOOKING_STEPS.payment
            });
        }

    }, [bookingFlowState]);

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            {
                bookingFlowState.step === BOOKING_STEPS.search &&
                <BookingFlowSearchStep setFlowState={setBookingFlowState} flowState={bookingFlowState}/>
            }
        </div>
    );
};

export default BookingFlowPage;