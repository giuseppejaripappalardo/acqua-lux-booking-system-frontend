import * as React from "react";
import {useEffect, useState} from "react";
import {BookingWithBoat} from "../../models/response/BookingResponse";
import {beautifyFromIso} from "../../utils/DatetimeUtil.ts";
import BookingService from "../../services/Booking/BookingService.ts";
import {Pencil, Trash} from "lucide-react";
import {BOOKING_METHODS_TRANSLATIONS} from "../../utils/Constants.ts";
import Spinner from "../../components/Layout/Spinner.tsx";

const MyBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingWithBoat[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        setIsLoading(true);
        BookingService.getReservations()
            .then((bookings) => {
                setBookings(bookings.data);
            })
            .catch(() => {

            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const paginated = bookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(bookings.length / itemsPerPage);

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

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pt-10 pb-16">
            <h1 className="text-3xl font-serif font-bold text-[#0A1F44] mb-6">
                Le mie prenotazioni
            </h1>

            {
                paginated.length === 0 && !isLoading ? (
                    <p className="text-gray-600">Non hai ancora effettuato prenotazioni.</p>
                ) : (
                    <div className="space-y-6">
                        {paginated.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >


                                <div className="flex-1 space-y-4">
                                    <h2 className="text-xl font-serif font-bold text-[#0A1F44]">
                                        Imbarcazione: <span className="text-[#D4AF37]">{booking.boat.name}</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 italic">{booking.boat.location}</p>

                                    <div className="text-sm text-gray-700 space-y-1 leading-relaxed">
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
                                        <p>
                                            <span
                                                className="font-semibold text-[#0A1F44]">Metodo di pagamento:</span>{" "}
                                            {BOOKING_METHODS_TRANSLATIONS[booking.payment_method]}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-[#0A1F44]">Totale:</span>{" "}
                                            {new Intl.NumberFormat("it-IT", {
                                                style: "currency",
                                                currency: "EUR",
                                                minimumFractionDigits: 2,
                                            }).format(booking.total_price)}
                                        </p>
                                    </div>

                                    <div className="mt-2">{renderStatusBadge(booking.reservation_status)}</div>
                                </div>

                                <div className="flex flex-col gap-3 mt-6 md:mt-0 md:items-end">
                                    <button
                                        className="flex items-center gap-2 text-[#0A1F44] hover:text-[#D4AF37] font-medium transition"

                                    >
                                        <Pencil size={16}/>
                                        Modifica
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition"

                                    >
                                        <Trash size={16}/>
                                        Cancella
                                    </button>
                                </div>


                            </div>
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center pt-6 gap-2">
                                {Array.from({length: totalPages}, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 text-sm font-medium rounded-full ${
                                            currentPage === i + 1
                                                ? "bg-[#D4AF37] text-white"
                                                : "bg-gray-200 text-[#0A1F44] hover:bg-gray-300"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                )}

            {
                isLoading && <Spinner />
            }
        </div>
    );
};

export default MyBookingsPage;