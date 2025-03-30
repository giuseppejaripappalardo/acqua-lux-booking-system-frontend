import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {DateTime, DateTimeMaybeValid} from "luxon";
import {useLocation, useNavigate} from "react-router-dom";

interface SearchFormProps {
    initialStartDate?: string;
    initialEndDate?: string;
    initialSeats?: number;
    setSearchStartDate?: (date: string) => void | null;
    setSearchEndDate?: (date: string) => void | null;
    setSearchSeats?: (seats: number) => void | null;
}

const SearchForm: React.FC<SearchFormProps> = ({
                                                   initialStartDate = "",
                                                   initialEndDate = "",
                                                   initialSeats = 1,
                                                   setSearchSeats = null,
                                                   setSearchStartDate = null,
                                                   setSearchEndDate = null
                                               }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [seats, setSeats] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [disableSearch, setDisableSearch] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const timezone = "Europe/Rome"
    /**
     *  Setto la data corrente con il timezone Europe/Rome
     *  Il backend si aspetta questo timezone, ma se passiamo
     *  il datetime senza timezone assumerà in automatico che è Europe/Rome
     *  Fatto ciò faremo lato server una conversione in UTC, perchè
     *  le date server side e su db sono tutte gestite in UTC per semplificare
     *  le verifiche sulla disponibilità delle imarcazioni
     */
    const now = DateTime.now().setZone(timezone);
    const today = now.toFormat("yyyy-MM-dd'T'HH:mm");

    const handleDatetimeValdation = useCallback((start: DateTimeMaybeValid, end: DateTimeMaybeValid) => {
        setDisableSearch(false);

        if (startDate === "" || endDate === "") {
            setDisableSearch(true);
            setError("")
            return;
        }

        if (start > end) {
            setError("La data di inizio deve essere precedente alla data di fine.");
            setDisableSearch(true);
            return;
        }

        if (start < now.plus({hours: 1})) {
            setError("La prenotazione deve iniziare almeno 1 ora dopo dell'ora corrente.");
            setDisableSearch(true);
            return;
        }

        const duration = end.diff(start, 'hours').hours;
        if (duration < 1) {
            setError("La durata minima della prenotazione è di 1 ora.");
            setDisableSearch(true);
            return;
        }
        setError(null);
    }, [now]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const start = DateTime.fromISO(startDate, {zone: timezone});
        const end = DateTime.fromISO(endDate, {zone: timezone});
        handleDatetimeValdation(start, end);

        const locationMatch = location.pathname.toLowerCase() === "/search-availability";
        if (!locationMatch) {
            navigate(`/search-availability?start_date=${start.toFormat("yyyy-MM-dd HH:mm")}&end_date=${end.toFormat("yyyy-MM-dd HH:mm")}&seats=${seats}`)
        } else {
            if (setSearchSeats) {
                setSearchSeats(seats);
            }
            if (setSearchStartDate) {
                let parsedStartDate = DateTime.fromISO(startDate);
                if (!parsedStartDate.isValid) {
                    parsedStartDate = DateTime.fromFormat(startDate, "yyyy-MM-dd HH:mm");
                }
                setSearchStartDate(parsedStartDate.toFormat("yyyy-MM-dd HH:mm"));
            }

            if (setSearchEndDate) {
                let parsedEndDate = DateTime.fromISO(endDate);
                if (!parsedEndDate.isValid) {
                    parsedEndDate = DateTime.fromFormat(endDate, "yyyy-MM-dd HH:mm");
                }
                setSearchEndDate(parsedEndDate.toFormat("yyyy-MM-dd HH:mm"));
            }

        }
    };

    useEffect(() => {
        setSeats(initialSeats);
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
    }, [initialEndDate, initialSeats, initialStartDate]);

    useEffect(() => {
        const start = DateTime.fromISO(startDate, {zone: timezone});
        const end = DateTime.fromISO(endDate, {zone: timezone});
        handleDatetimeValdation(start, end);
    }, [endDate, handleDatetimeValdation, startDate]);

    return (
        <form
            onSubmit={handleSubmit}
            className={`bg-white/20 backdrop-blur-lg p-6 rounded-md shadow-2xl mb-5 text-white w-full`}
        >
            <div className={"flex flex-col md:flex-row flex-wrap gap-4 w-full"}>
                <div className="flex-1 min-w-[180px]">
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1 text-left">Data inizio</label>
                    <input
                        id="startDate"
                        type="datetime-local"
                        required
                        min={today as string}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="appearance-none w-full px-4 py-2 border rounded-md bg-white text-black border-gray-300 placeholder-gray-500 text-base font-sans leading-tight focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"                    />
                </div>

                <div className="flex-1 min-w-[180px]">
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1 text-left">Data fine</label>
                    <input
                        id="endDate"
                        type="datetime-local"
                        required
                        min={startDate as string || today as string}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="appearance-none w-full px-4 py-2 border rounded-md bg-white text-black border-gray-300 placeholder-gray-500 text-base font-sans leading-tight focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                </div>

                <div className="flex-1 min-w-[100px]">
                    <label htmlFor="seats" className="block text-sm font-medium mb-1 text-left">Posti</label>
                    <input
                        id="seats"
                        type="number"
                        min={1}
                        required
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border rounded-md bg-white text-black border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full sm:w-auto py-2 px-6 bg-[#D4AF37] hover:bg-yellow-600 text-white rounded-md font-medium transition disabled:cursor-not-allowed disabled:bg-gray-400/60 disabled:hover:bg-gray-400/60"
                        disabled={disableSearch}
                    >
                        Cerca
                    </button>
                </div>
            </div>

            {!error && (
                // Metto questo placeholder per evitare problemi di Cumulative Layout Shifting
                <div className="text-red-400 text-sm sm:col-span-4 mt-2 h-4"></div>
            )}


            {error && (
                <div className="text-red-400 text-sm sm:col-span-4 mt-2 h-4">
                    {error}
                </div>
            )}
        </form>
    );
};

export default SearchForm;