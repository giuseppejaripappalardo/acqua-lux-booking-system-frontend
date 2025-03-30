import * as React from "react";
import {useNavigate} from "react-router-dom";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage.tsx";
import {beautifyDatetime} from "../../utils/DatetimeUtil.ts";
import {BOOKING_METHODS_TRANSLATIONS} from "../../utils/Constants.ts";

interface BookingFlowConfirmationProps {
    flowState: BookingFlowState
}

const BookingFlowConfirmation: React.FC<BookingFlowConfirmationProps> = ({flowState}) => {
    const navigate = useNavigate();
    const {booking, selectedBoat, startDate, endDate, seats} = flowState;

    if (!booking || !selectedBoat) return null;


    return (
        <div className="w-full max-w-4xl mx-auto px-4 pt-10 pb-16">
            <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
                <h2 className="font-serif text-[#0A1F44] text-3xl font-bold">
                    Prenotazione confermata!
                </h2>

                <div className="text-[#0A1F44]">
                    <p className="text-lg">
                        Grazie per aver prenotato con Acqua<span className="text-[#D4AF37]">Lux</span>.
                    </p>
                    <p className="mt-2 text-md">
                        Il tuo codice di prenotazione è:
                        <span className="font-semibold ml-2 bg-[#0A1F44] text-white px-3 py-1 rounded-md">
                            {booking.reservation_code}
                        </span>
                    </p>
                </div>

                <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div>
                        <h3 className="font-bold text-[#0A1F44] mb-2">Dettagli imbarcazione</h3>
                        <p><strong>Nome:</strong> {selectedBoat.name}</p>
                        <p><strong>Luogo:</strong> {selectedBoat.location}</p>
                        <p><strong>Prezzo orario: </strong>
                            {new Intl.NumberFormat('it-IT', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 2,
                            }).format(selectedBoat.price_per_hour ?? 0)}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#0A1F44] mb-2">Dettagli prenotazione</h3>
                        <p><strong>Data inizio:</strong> {beautifyDatetime(startDate)}</p>
                        <p><strong>Data fine:</strong> {beautifyDatetime(endDate)}</p>
                        <p><strong>Posti:</strong> {seats}</p>
                        <p><strong>Metodo di pagamento:</strong> {BOOKING_METHODS_TRANSLATIONS[booking.payment_method]}</p>
                        <p><strong>Totale: </strong>
                            {new Intl.NumberFormat('it-IT', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 2,
                            }).format(booking.total_price)}
                        </p>
                    </div>
                </div>

                {booking.notes && (
                    <div className="mt-4">
                        <h3 className="font-bold text-[#0A1F44] mb-2">Note</h3>
                        <p className="text-gray-700">{booking.notes}</p>
                    </div>
                )}

                <div className="flex justify-end pt-6 border-t">
                    <button
                        onClick={() => navigate("/my-bookings")}
                        className="bg-[#D4AF37] hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium transition"
                    >
                        Vai alle mie prenotazioni
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingFlowConfirmation;