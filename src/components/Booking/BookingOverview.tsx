import {MapPinCheckInside, Users} from "lucide-react";
import {BOOKING_STEPS} from "../../utils/Constants.ts";
import * as React from "react";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage.tsx";
import {DateTime} from "luxon";
import {beautifyDatetime} from "../../utils/DatetimeUtil.ts";
import useAuth from "../../hooks/useAuth.ts";

interface BookingOverviewProps {
    flowStateBoat: BookingFlowState;
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
}

const BookingOverview: React.FC<BookingOverviewProps> = ({flowStateBoat, setFlowState}) => {

    const {getLoggedUser} = useAuth();
    const loggedUser = getLoggedUser();

    /**
     * Utilizzo questa utility per calcolare il costo totale del noleggio.
     * Lo stesso calcolo viene fatto lato backend.
     */
    const calculateTotalCost = () => {
        if (!flowStateBoat.selectedBoat?.price_per_hour || !flowStateBoat.startDate || !flowStateBoat.endDate) {
            return 0;
        }

        /**
         * Per poter moltiplicare il costo orario per le ore totali ho bisogno di estrarre le
         * ore totali previste dal range di date di prenotazione.
         */
        const startDateTime = DateTime.fromISO(flowStateBoat.startDate);
        const endDateTime = DateTime.fromISO(flowStateBoat.endDate);

        if (!startDateTime.isValid || !endDateTime.isValid) {
            return 0;
        }

        /**
         * A questo punto posso calcolare la differenza in ore tra la datatime di fine e la datetime
         * di inizio prenotazione, cosi da ricavare le ore.
         * Facciamo un arrotondamento per eccesso come facco sul backend per avere coerenza.
         */
        const diffInHours = Math.ceil(endDateTime.diff(startDateTime, 'hours').hours);


        /**
         * Arrivato qui mi basterà semplicemente moltiplicare il numero di ore
         * per il costo orario dell'imbarcazione.
         */
        return diffInHours * flowStateBoat.selectedBoat.price_per_hour;
    };

    const totalCost = calculateTotalCost();


    return (
        <>
            {flowStateBoat && flowStateBoat.selectedBoat && (
                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={flowStateBoat.selectedBoat.image_path}
                        alt={flowStateBoat.selectedBoat.name}
                        className="rounded-md w-full md:w-1/3 object-cover"
                    />
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif font-bold text-[#0A1F44]">
                            {flowStateBoat.selectedBoat.name}
                        </h3>
                        <p className="text-gray-700 mt-2">{flowStateBoat.selectedBoat.description}</p>
                        <div className={"mt-4"}>
                            <div className="flex items-center text-gray-500 mr-4">
                                <Users className="pr-2"/>
                                <span>{flowStateBoat.selectedBoat.seat} posti</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <MapPinCheckInside className="pr-2"/>
                                {flowStateBoat.selectedBoat.location}
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setFlowState((prev) => ({
                                    ...prev,
                                    step: BOOKING_STEPS.search,
                                    selectedBoat: null,
                                    changeBoat: true,
                                }))
                            }
                            className="mt-4 text-sm underline text-[#0A1F44] hover:text-[#D4AF37]"
                        >
                            Cambia imbarcazione
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-[#F8F9FA] p-4 rounded-md border border-gray-200">
                <ul className="text-gray-800 space-y-1 text-sm">
                    {loggedUser && (
                        <li className="pt-4 border-t border-gray-300 mt-2">
                            <strong>Prenotato da:</strong>
                            <div className="text-sm text-gray-700 mt-1">
                                <p className={"font-bold"}>{loggedUser.firstname} {loggedUser.lastname}</p>
                            </div>
                        </li>
                    )}
                    <li>
                        <strong>Posti:</strong> {flowStateBoat.seats}
                    </li>
                    <li>
                        <strong>Dal:</strong> {beautifyDatetime(flowStateBoat.startDate)}
                    </li>
                    <li>
                        <strong>Al:</strong> {beautifyDatetime(flowStateBoat.endDate)}
                    </li>
                    <li>
                        <strong>Prezzo orario: </strong>
                        {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 2,
                        }).format(flowStateBoat.selectedBoat?.price_per_hour ?? 0)}
                    </li>
                    <li className="font-semibold text-base pt-2 border-t border-gray-300 mt-2">
                        <strong>Totale stimato: </strong>
                        {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 2,
                        }).format(totalCost)}
                        <small className="text-gray-500 block mt-1">
                            Il costo viene calcolato su ore intere, con arrotondamento per eccesso.
                        </small>
                    </li>
                </ul>
                <button
                    onClick={() =>
                        setFlowState((prev) => ({
                            ...prev,
                            step: BOOKING_STEPS.search,
                            selectedBoat: null,
                            searchAttempt: false
                        }))
                    }
                    className="mt-2 text-sm underline text-[#0A1F44] hover:text-[#D4AF37]"
                >
                    Cambia date
                </button>
            </div>
        </>
    )
};

export default BookingOverview;