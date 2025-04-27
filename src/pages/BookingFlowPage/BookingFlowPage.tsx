import * as React from "react";
import {useEffect, useState} from "react";
import BookingFlowSearchStep from "../../components/Booking/BookingFlowSearchStep.tsx";
import {Boat} from "../../models/object/Boat.ts";
import {BookingFlowSteps, BookingPaymentMethods} from "../../models/object/Bookings.ts";
import {BOOKING_PAYMENT_METHODS, BOOKING_STEPS} from "../../utils/Constants.ts";
import BookingFlowPaymentStep from "../../components/Booking/BookingFlowPaymentStep.tsx";
import BookingOverview from "../../components/Booking/BookingOverview.tsx";
import AppModal from "../../components/Modal/AppModal.tsx";
import {BookingWithBoat} from "../../models/response/BookingResponse.ts";
import BookingFlowConfirmation from "../../components/Booking/BookingFlowConfirmation.tsx";

export interface BookingFlowState {
    step: BookingFlowSteps;
    selectedBoat: Boat | null;
    startDate: string;
    endDate: string;
    seats: number;
    notes: string;
    paymentMethod: BookingPaymentMethods;
    firstRunCompleted: boolean;
    searchAttempt: boolean;
    changeBoat: boolean;
    showErrorModal: boolean;
    modalErrorMsg: string;
    modalHideCloseButton: boolean;
    modalPrimaryButton: {
        link: string;
        label: string;
    } | null;
    booking: BookingWithBoat | null;
    isEditMode: boolean;
    originalBooking: BookingWithBoat | null;
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
    /**
     * Inizializzo lo state con valori di default.
     * Lo step iniziale sarà sempre Search, poiché l'utente avvierà il flusso
     * di prenotazione a partire dalla verifica delle disponibilità.
     */
    const [bookingFlowState, setBookingFlowState] = useState<BookingFlowState>({
        step: BOOKING_STEPS.search,
        seats: 1,
        selectedBoat: null,
        startDate: "",
        endDate: "",
        notes: "",
        paymentMethod: BOOKING_PAYMENT_METHODS.BANK_TRANSFER,
        firstRunCompleted: false,
        searchAttempt: false,
        changeBoat: false,
        showErrorModal: false,
        modalErrorMsg: "",
        modalPrimaryButton: null,
        modalHideCloseButton: false,
        booking: null,
        isEditMode: false,
        originalBooking: null,
    });
    /**
     * Come dependencies a questo useEffect setto l'ascolto di bookingFlowState.
     * Se lo step è === a search e ho selezionato una imbarcazione allora cambiamo lo step
     * in payment, ovvero l'interfaccia che mostra il riepilogo di prenotazione e le modalità
     * di pagamento.
     */
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

            {/*
                Se lo step è search mostriamo BookingFlowStepSearch
                Componente implementato ad hoc per la pagina di ricerca delle disponibilità.
            */}
            {bookingFlowState.step === BOOKING_STEPS.search && (
                <BookingFlowSearchStep setFlowState={setBookingFlowState} flowState={bookingFlowState}/>
            )}
            {/*
                Se lo step è payment: Mostro la pagina di riepilogo prenotazione associata
                al componente per la selezione del metodo di pagamento.
            */}
            {bookingFlowState.step === BOOKING_STEPS.payment && (
                <div className="mt-6">
                    <div className="w-full bg-white p-6 rounded-xl shadow-xl space-y-6">
                        <h2 className="font-serif text-[#0A1F44] text-3xl font-bold mb-6">
                            Riepilogo prenotazione
                        </h2>
                        <BookingOverview flowStateBoat={bookingFlowState} setFlowState={setBookingFlowState}/>
                        <BookingFlowPaymentStep setFlowState={setBookingFlowState} flowState={bookingFlowState}/>
                    </div>
                </div>
            )}
            {/*
                Se lo step è confirm mostro il componente che mostra l'esito positivo
                della prenotazione effettuata.
            */}
            {
                bookingFlowState.step === BOOKING_STEPS.confirm &&
                <BookingFlowConfirmation flowState={bookingFlowState}/>
            }
            {/*
                Questo è un modale utilizzato nel caso in cui nei vari step si verifica un errore.
                Serve per informare l'utente che qualcosa è andato storto e fornire un feedback
                per risolvere e proseguire con la prenotazione.
            */}
            <AppModal
                open={bookingFlowState.showErrorModal}
                onClose={() => setBookingFlowState(prevState => ({
                    ...prevState,
                    showErrorModal: false,
                    modalErrorMsg: ""
                }))}
                message={bookingFlowState.modalErrorMsg}
            />
        </div>
    );
};

export default BookingFlowPage;