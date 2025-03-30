import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {DateTime, DateTimeMaybeValid} from "luxon";
import {useLocation, useNavigate} from "react-router-dom";
import {BookingSearchFields} from "../../models/object/Bookings.ts";
import {stateStdDatetimeFormat, timezone} from "../../utils/DatetimeUtil.ts";

interface SearchFormProps {
    flowState: BookingSearchFields;
    setFlowState: React.Dispatch<React.SetStateAction<BookingSearchFields>>;
    getAvailabilities?: () => void | null;
}

const SearchForm: React.FC<SearchFormProps> = ({flowState, setFlowState, getAvailabilities = null}) => {
    const [error, setError] = useState<string | null>(null);
    const [disableSearch, setDisableSearch] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const today = DateTime.now().setZone(timezone).toFormat(stateStdDatetimeFormat);

    const handleDatetimeValidation = useCallback((start: DateTimeMaybeValid, end: DateTimeMaybeValid) => {
        const now = DateTime.now().setZone(timezone);

        if (flowState.startDate === "" || flowState.endDate === "") {
            setDisableSearch(true);
            setError("");
            return;
        }

        if (start > end) {
            setError("La data di inizio deve essere precedente alla data di fine.");
            setDisableSearch(true);
            return;
        }

        if (start < now.plus({hours: 1})) {
            setError("La prenotazione deve iniziare almeno con 1 ora di preavviso.");
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
        setDisableSearch(false);
    }, [flowState.startDate, flowState.endDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const start = DateTime.fromISO(flowState.startDate, {zone: timezone});
        const end = DateTime.fromISO(flowState.endDate, {zone: timezone});
        handleDatetimeValidation(start, end);

        const locationMatch = location.pathname.toLowerCase() === "/search-availability";
        if (!locationMatch) {
            navigate('/search-availability', {
                state: {
                    searched_start_date: start.toFormat(stateStdDatetimeFormat),
                    searched_end_date: end.toFormat(stateStdDatetimeFormat),
                    searched_seats: flowState.seats,
                }
            });
        } else {
            setFlowState(prevState => ({
                ...prevState,
                startDate: start.toFormat(stateStdDatetimeFormat),
                endDate: end.toFormat(stateStdDatetimeFormat),
                seats: flowState.seats,
            }));

            if (getAvailabilities !== null) {
                getAvailabilities();
            }
        }
    };

    useEffect(() => {
        const start = DateTime.fromISO(flowState.startDate, {zone: timezone});
        const end = DateTime.fromISO(flowState.endDate, {zone: timezone});
        handleDatetimeValidation(start, end);
    }, [flowState.startDate, flowState.endDate, handleDatetimeValidation]);


    return (
        <form
            onSubmit={handleSubmit}
            className={`bg-white/20 backdrop-blur-lg p-6 rounded-md shadow-2xl mb-5 text-white w-full`}
        >

            <p className="text-sm text-white mt-2">
                Stato validazione: <strong>{disableSearch ? "DISABILITATO" : "OK"}</strong>
            </p>

            <div className={"flex flex-col md:flex-row flex-wrap gap-4 w-full"}>
                <div className="flex-1 min-w-[180px]">
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1 text-left">Data inizio</label>
                    <input
                        id="startDate"
                        type="datetime-local"
                        required
                        min={today}
                        value={flowState.startDate}
                        onChange={(e) => setFlowState(prevState => ({...prevState, startDate: e.target.value}))}
                        className="appearance-none w-full px-4 py-2 border rounded-md bg-white text-black border-gray-300 placeholder-gray-500 text-base font-sans leading-tight focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"/>
                </div>

                <div className="flex-1 min-w-[180px]">
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1 text-left">Data fine</label>
                    <input
                        id="endDate"
                        type="datetime-local"
                        required
                        value={flowState.endDate}
                        onChange={(e) => setFlowState(prevState => ({...prevState, endDate: e.target.value}))}
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
                        value={flowState.seats}
                        onChange={(e) => setFlowState(prevState => ({...prevState, seats: parseInt(e.target.value)}))}
                        className="w-full px-4 py-2 border rounded-md bg-white text-black border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full sm:w-auto py-2 px-6 bg-[#D4AF37] hover:bg-yellow-600 text-white rounded-md font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400/60 disabled:hover:bg-gray-400/60"
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