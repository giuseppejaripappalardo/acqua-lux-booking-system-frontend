import {MapPinCheckInside, Users} from "lucide-react";
import {BOOKING_STEPS} from "../../utils/Constants.ts";
import * as React from "react";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage.tsx";

interface BookingOverviewProps {
    flowStateBoat: BookingFlowState;
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
}

const BookingOverview: React.FC<BookingOverviewProps> = ({flowStateBoat, setFlowState}) => {
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
                    <li>
                        <strong>Posti:</strong> {flowStateBoat.seats}
                    </li>
                    <li>
                        <strong>Dal:</strong> {flowStateBoat.startDate}
                    </li>
                    <li>
                        <strong>Al:</strong> {flowStateBoat.endDate}
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