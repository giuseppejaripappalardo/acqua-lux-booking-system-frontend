import * as React from "react";
import {statusTypes} from "../../models/object/Boat.ts";


const statusStyles = {
    available: "bg-green-100 text-green-600",
    maintenance: "bg-yellow-100 text-yellow-600",
    out_of_service: "bg-red-100 text-red-600",
};

interface StatusBadgeProps {
    status: statusTypes;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
    <span className={`text-sm font-semibold py-1 px-3 rounded-full ${statusStyles[status]}`}>
    {status === "available" && "Operativa"}
        {status === "maintenance" && "Manutenzione"}
        {status === "out_of_service" && "Fuori Servizio"}
  </span>
);

export default StatusBadge;