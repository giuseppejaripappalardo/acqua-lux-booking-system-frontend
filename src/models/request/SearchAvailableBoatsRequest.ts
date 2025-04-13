export interface SearchAvailableBoatsRequest {
    seat: number;
    start_date: string;
    end_date: string;
}

export interface EditSearchAvailableBoatsRequest extends SearchAvailableBoatsRequest {
    booking_id: number;
}