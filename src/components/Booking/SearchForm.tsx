import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {DateTime, DateTimeMaybeValid} from "luxon";
import {useLocation, useNavigate} from "react-router-dom";
import {BookingSearchFields} from "../../models/object/Bookings.ts";
import {stateStdDatetimeFormat, tzEuropeRome} from "../../utils/DatetimeUtil.ts";

interface SearchFormProps {
    flowState: BookingSearchFields;
    setFlowState: React.Dispatch<React.SetStateAction<BookingSearchFields>>;
    getAvailabilities?: () => void | null;
    bgDark?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({flowState, setFlowState, getAvailabilities = null, bgDark = false}) => {
    const [error, setError] = useState<string | null>(null);
    const [disableSearch, setDisableSearch] = useState<boolean>(false);
    const [editModeFirstAttempt, setEditModeFirstAttempt] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Di base metto un value iniziale con due ore di buffer.
     * Lato backend il buffer è 1 ora, ma per stare safe mettiamo due.
     * Poi in ogni caso l'utente può anticiparlo ad 1 ora, ma mai prima perché non passerebbe la validazione.
     */
    const today = DateTime.now().setZone(tzEuropeRome).plus({hour: 1}).toFormat(stateStdDatetimeFormat);

    const handleDatetimeValidation = useCallback((start: DateTimeMaybeValid, end: DateTimeMaybeValid) => {
        const now = DateTime.now().setZone(tzEuropeRome);

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
        const start = DateTime.fromISO(flowState.startDate, {zone: tzEuropeRome});
        const end = DateTime.fromISO(flowState.endDate, {zone: tzEuropeRome});
        handleDatetimeValidation(start, end);

        const locationMatch = location.pathname.toLowerCase() === "/search-availability";
        console.log(flowState.isEditMode)
        if (!locationMatch && !flowState.isEditMode) {
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
        if (flowState.isEditMode && !editModeFirstAttempt) {
            console.log("la prima volta skippo")
            setEditModeFirstAttempt(true);
            /* bypassiamo il controllo. Il motivo dello skip è che se per qualche motivo
                 La data di inizio è precedente, partirebbe la chiamata con relativo modal
                di errore, in quanto la ricerca non si può fare a posteriori.
                 Skippo solo per correttezza visuale, anche se poi di base la modifica
                 della prenotazione prevede opportuni controlli di validazione lato backend.
             */
            return
        }
        const start = DateTime.fromISO(flowState.startDate, {zone: tzEuropeRome});
        const end = DateTime.fromISO(flowState.endDate, {zone: tzEuropeRome});
        handleDatetimeValidation(start, end);
    }, [flowState.startDate, flowState.endDate, handleDatetimeValidation, flowState.isEditMode]);


    return (
        <form
            onSubmit={handleSubmit}
            className={`${bgDark ? 'bg-[#0A1F44]' : 'bg-white/20'} backdrop-blur-lg p-6 rounded-md shadow-2xl mb-5 text-white w-full`}
        >

            {/*
               RIGA INSERITA SOLO PER SCOPO DI DEBUG
            */}
            {/*<p className="text-sm text-white mt-2">*/}
            {/*    Stato validazione: <strong>{disableSearch ? "DISABILITATO" : "OK"}</strong>*/}
            {/*</p>*/}

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