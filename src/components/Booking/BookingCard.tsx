import {beautifyFromIso} from "../../utils/DatetimeUtil.ts";
import {BOOKING_METHODS_TRANSLATIONS, BOOKING_STATUSES} from "../../utils/Constants.ts";
import {Pencil, Trash} from "lucide-react";
import * as React from "react";
import {BookingWithBoat} from "../../models/response/BookingResponse.ts";
import {useNavigate} from "react-router-dom";
import {formatCurrency} from "../../utils/CurrencyUtil.ts";
import {AppModalProps} from "../Modal/AppModal.tsx";
import BookingService from "../../services/Booking/BookingService.ts";
import {DeleteBookingRequest} from "../../models/request/BookingRequest.ts";

interface BookingCardProps {
    booking: BookingWithBoat;
    showActions?: boolean;
    showIsEditMode?: boolean;
    setModal?: React.Dispatch<React.SetStateAction<AppModalProps>> | null;
    setRefreshList?: React.Dispatch<React.SetStateAction<boolean>> | null;
}

const BookingCard: React.FC<BookingCardProps> = ({
                                                     booking,
                                                     showActions = true,
                                                     showIsEditMode = false,
                                                     setModal = null,
                                                     setRefreshList = null,
                                                 }) => {
    const navigate = useNavigate();
    const renderStatusBadge = (status: string) => {
        const base = "text-sm font-semibold px-2 py-1 rounded-md";
        switch (status) {
            case "CONFIRMED":
                return <span className={`${base} bg-green-100 text-green-700`}>Confermata</span>;
            case "PENDING":
                return <span className={`${base} bg-yellow-100 text-yellow-700`}>In attesa</span>;
            case "CANCELLED":
                return <span className={`${base} bg-red-100 text-red-700`}>Annullata</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
        }
    };

    const renderEditPriceDifference = () => {
        const priceDiff = booking.price_difference;

        if (priceDiff > 0) {
            return (
                <p className="text-sm text-yellow-700">
                    Questa prenotazione è stata modificata con un costo aggiuntivo di{" "}
                    <strong>{formatCurrency(priceDiff)}</strong>, registrato al momento dell’aggiornamento.
                </p>
            );
        } else if (priceDiff < 0) {
            return (
                <p className="text-sm text-green-700">
                    Questa prenotazione è stata modificata con un costo inferiore di{" "}
                    <strong>{formatCurrency(Math.abs(priceDiff))}</strong>. È stato registrato un rimborso.
                </p>
            );
        } else {
            return (
                <p className="text-sm text-gray-700">
                    La prenotazione è stata modificata senza variazioni di prezzo.
                </p>
            );
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!setModal) return;
        if (!setRefreshList) return;
        const bookingDeleteRequest: DeleteBookingRequest = {
            booking_id: booking.id
        }
        BookingService.deleteBooking(bookingDeleteRequest).then(res => {
            if (res.success) {
                setModal(prevState => ({
                    ...prevState,
                    open: false,
                    primaryButton: null,
                }));
                setRefreshList(true);
            }
        }).catch((err) => {
            setModal(prevState => ({
                        ...prevState,
                        open: true,
                        title: "Si è verificato un errore",
                        message: err.message,
                        primaryButton: null
                    }
                )
            );
        });
    }

    const handleModal = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!setModal) return;

        setModal(prevState => ({
                ...prevState,
                title: "Conferma cancellazione",
                message: "Sei sicuro di voler cancellare questa prenotazione?",
                secondaryButtonLabel: "Annulla",
                open: true,
                primaryButton: {
                    label: "Conferma operazione",
                    action: handleDelete,
                }
            })
        );
    }

    return (
        <div
            key={booking.id}
            className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >


            <div className="flex-1 space-y-3">
                <h2 className="text-xl font-serif font-bold text-[#0A1F44]">
                    Imbarcazione: <span className="text-[#D4AF37]">{booking.boat.name}</span>
                </h2>

                <p className="text-sm text-gray-600 italic">
                    <span className="font-semibold text-[#0A1F44]">Location:</span> {booking.boat.location}
                </p>

                <div className="text-sm text-gray-700 space-y-1 leading-relaxed">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-[#0A1F44]">Prenotazione effettuata il:</span>{" "}
                        {beautifyFromIso(booking.created_at)}
                    </p>
                    {
                        booking.created_at !== booking.modified_at &&
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold text-[#0A1F44]">Prenotazione modificata il:</span>{" "}
                            {beautifyFromIso(booking.modified_at)}
                        </p>
                    }

                    <p>
                        <span className="font-semibold text-[#0A1F44]">Codice:</span>{" "}
                        {booking.reservation_code}
                    </p>
                    <p>
                        <span className="font-semibold text-[#0A1F44]">Dal:</span>{" "}
                        {beautifyFromIso(booking.start_date)}
                    </p>
                    <p>
                        <span className="font-semibold text-[#0A1F44]">Al:</span>{" "}
                        {beautifyFromIso(booking.end_date)}
                    </p>
                    <p>
                        <span className="font-semibold text-[#0A1F44]">Posti:</span> {booking.seat}
                    </p>
                    <p><span className="font-semibold text-[#0A1F44]">Metodo di pagamento:</span>{" "}
                        {BOOKING_METHODS_TRANSLATIONS[booking.payment_method]}
                    </p>
                    <p><span className="font-semibold text-[#0A1F44]">Totale:</span>{" "}
                        {formatCurrency(booking.total_price)}
                    </p>
                </div>

                {
                    !showIsEditMode && booking.created_at !== booking.modified_at &&
                    renderEditPriceDifference()
                }

                <div className="mt-2">{renderStatusBadge(booking.reservation_status)}</div>
            </div>

            {
                booking.reservation_status === BOOKING_STATUSES.CONFIRMED && showActions &&
                <div className="flex flex-col gap-3 mt-6 md:mt-0 md:items-end">
                    <button
                        className="flex items-center gap-2 text-[#0A1F44] hover:text-[#D4AF37] font-medium transition cursor-pointer"
                        onClick={() => navigate(`/edit-booking/${booking.id}`)}
                    >
                        <Pencil size={16}/>
                        Modifica
                    </button>
                    <button
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition cursor-pointer"
                        onClick={handleModal}
                    >
                        <Trash size={16}/>
                        Cancella
                    </button>
                </div>
            }
        </div>
    )
}

export default BookingCard;