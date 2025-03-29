export type statusTypes = "available" | "maintenance" | "out_of_service";

interface BoatStatus {
    id: number;
    name: statusTypes;
    description: string;
}

export interface Boat {
    id: number;
    name: string;
    description: string;
    seat: number;
    price_per_hour: number;
    location: string;
    image_path: string | undefined;
    boat_status: BoatStatus;
}