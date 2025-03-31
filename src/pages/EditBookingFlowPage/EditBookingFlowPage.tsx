import * as React from "react";
import {useEffect, useState} from "react";
import BookingFlowSearchStep from "../../components/Booking/BookingFlowSearchStep.tsx";
import {BOOKING_PAYMENT_METHODS, BOOKING_STEPS} from "../../utils/Constants.ts";
import BookingFlowPaymentStep from "../../components/Booking/BookingFlowPaymentStep.tsx";
import BookingOverview from "../../components/Booking/BookingOverview.tsx";
import ErrorModal from "../../components/Modal/ErrorModal.tsx";
import BookingFlowConfirmation from "../../components/Booking/BookingFlowConfirmation.tsx";
import {BookingFlowState} from "../BookingFlowPage/BookingFlowPage.tsx";
import RemindOriginalBooking from "../../components/Booking/RemindOriginalBooking.tsx";
import {useParams} from "react-router-dom";
import BookingService from "../../services/Booking/BookingService.ts";
import {ViewBooking} from "../../models/request/BookingRequest.ts";
import Spinner from "../../components/Layout/Spinner.tsx";
import {parseUtcToLocal} from "../../utils/DatetimeUtil.ts";


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
        notes: "",
        paymentMethod: BOOKING_PAYMENT_METHODS.BANK_TRANSFER,
        firstRunCompleted: false,
        searchAttempt: false,
        changeBoat: false,
        showErrorModal: false,
        modalPrimaryButton: null,
        modalErrorMsg: "",
        modalHideCloseButton: false,
        booking: null,
        isEditMode: true,
        originalBooking: null,
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {id} = useParams();

    useEffect(() => {
        if (bookingFlowState.step === BOOKING_STEPS.search &&
            bookingFlowState.selectedBoat !== null) {
            setBookingFlowState({
                ...bookingFlowState,
                step: BOOKING_STEPS.payment
            });
        }
    }, [bookingFlowState]);

    useEffect(() => {
        /**
         * Recuperiamo la prenotazione da modificare cosi da mostrarla all'utente.
         * Settiamo lo state con tutte le informazioni precedentemente disponibili,
         * cosi da evitare che l'utente debba effettuare il refill dei dati non necessari.
         */
        if (!bookingFlowState.originalBooking && id) {
            setIsLoading(true)
            const requestData: ViewBooking = {
                booking_id: parseInt(id),
            }


            BookingService.getReservation(requestData).then(booking => {
                console.log(booking.data.start_date)
                setBookingFlowState(prevState => ({
                    ...prevState,
                    originalBooking: booking.data,
                    startDate: parseUtcToLocal(booking.data.start_date),
                    endDate: parseUtcToLocal(booking.data.end_date),
                    notes: booking.data.notes,
                    paymentMethod: booking.data.payment_method,
                    seats: booking.data.seat
                }))
            }).catch((err) => {
                bookingFlowState.showErrorModal = true;
                bookingFlowState.modalErrorMsg = err.message;
                bookingFlowState.modalHideCloseButton = true;
                bookingFlowState.modalPrimaryButton = {
                    link: "/my-bookings",
                    label: "Torna alle tue prenotazioni"
                };
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }, [bookingFlowState, bookingFlowState.originalBooking, id]);

    if (isLoading) {
        return (
            <Spinner/>
        )
    }

    return (
        <div className="w-full mx-auto px-4 pt-8 pb-16">

            {bookingFlowState.step === BOOKING_STEPS.search && (
                <>
                    <RemindOriginalBooking booking={bookingFlowState.originalBooking} isEditMode={bookingFlowState.isEditMode}/>
                    <BookingFlowSearchStep setFlowState={setBookingFlowState} flowState={bookingFlowState}/>
                </>
            )}

            {bookingFlowState.step === BOOKING_STEPS.payment && (
                <>
                    <RemindOriginalBooking booking={bookingFlowState.originalBooking} isEditMode={bookingFlowState.isEditMode}/>
                    <div className="mt-6">
                        <div className="w-full bg-white p-6 rounded-xl shadow-xl space-y-6">
                            <h2 className="font-serif text-[#0A1F44] text-3xl font-bold mb-6">
                                Riepilogo prenotazione
                            </h2>
                            <BookingOverview flowStateBoat={bookingFlowState} setFlowState={setBookingFlowState}/>
                            <BookingFlowPaymentStep setFlowState={setBookingFlowState} flowState={bookingFlowState}/>
                        </div>
                    </div>
                </>
            )}

            {
                bookingFlowState.step === BOOKING_STEPS.confirm &&
                <BookingFlowConfirmation flowState={bookingFlowState}/>
            }

            <ErrorModal
                open={bookingFlowState.showErrorModal}
                primaryButton={bookingFlowState.modalPrimaryButton ?? null}
                hideCloseButton={bookingFlowState.modalHideCloseButton ?? false}
                onClose={
                    () => setBookingFlowState(prevState => ({
                            ...prevState,
                            showErrorModal: false,
                            modalErrorMsg: "",
                            modalPrimaryButton: null,
                            modalHideCloseButton: false,
                        })
                    )
                }
                message={bookingFlowState.modalErrorMsg}
            />
        </div>
    );
};

export default BookingFlowPage;