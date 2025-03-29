import * as React from "react";
import {Boat} from "../../models/object/Boat.ts";
import {MapPinCheckInside, Users} from "lucide-react";
import StatusBadge from "./StatusBadge.tsx";

interface BoatCardProps {
    boat: Boat;
    showSelection?: boolean;
}

const BoatCard: React.FC<BoatCardProps> = ({boat, showSelection = false}) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.01] hover:shadow-xl transition-transform transition-shadow duration-300 ${showSelection ? 'cursor-pointer' : ''}`}>
            <img src={boat.image_path} alt={boat.name} className="h-64 sm:h-72 md:h-80 w-full object-cover"/>
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold font-serif">{boat.name}</h3>
                    <StatusBadge status={boat.boat_status.name}/>
                </div>
                <p className="text-gray-600 mb-4 mt-3">{boat.description}</p>
                <div className="flex flex-col flex-wrap gap-2 items-left mt-2">
                    <div className="flex items-center text-gray-500 mr-4">
                        <Users className="pr-2"/>
                        <span>{boat.seat} posti</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <MapPinCheckInside className="pr-2"/>
                        {boat.location}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-[#D4AF37] font-semibold text-sm">A partire da {boat.price_per_hour}€/ora</span>
                    {showSelection &&
                        <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-full cursor-pointer">Prenota</button>
                    }
                </div>
            </div>
        </div>
    )
}
export default BoatCard;