import SearchForm from "./SearchForm.tsx";
import BoatCard from "../Card/BoatCard.tsx";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import {useLocation} from "react-router-dom";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage.tsx";
import {BookingSearchFields} from "../../models/object/Bookings.ts";
import {SearchAvailableBoatsRequest} from "../../models/request/SearchAvailableBoatsRequest.ts";
import BoatService from "../../services/Boat/BoatService.ts";

interface BookingFlowSearchStepProps {
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
    flowState: BookingFlowState;
}

const BookingFlowSearchStep: React.FC<BookingFlowSearchStepProps> = ({setFlowState, flowState}) => {

    const [boats, setBoats] = useState<BoatResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const location = useLocation();

    const messages = {
        ENTER_DATE_TO_SERACH: "Inserisci la data di inizio e fine per effettuare la ricerca delle disponibilità.",
        CHANGE_DATE_AND_SEARCH: "Cambia le date e clicca sul tasto cerca per verificare le disponibilità.",
        NOT_FOUND: "Nessuna imbarcazione disponibile per i criteri selezionati.",
    }

    const handleSearch = useCallback(() => {
        if (flowState.startDate === "" || flowState.endDate === "" || isNaN(flowState.seats)) return;
        setIsLoading(true);
        const SearchRequest: SearchAvailableBoatsRequest = {
            start_date: flowState.startDate,
            end_date: flowState.endDate,
            seat: flowState.seats,
        }
        BoatService.searchAvailableBoats(SearchRequest).then((boats) => {
            setBoats(boats);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
        setFlowState(prevState => ({
            ...prevState,
            searchAttempt: true,
            changeBoat: false,
        }))
    }, [flowState.endDate, flowState.seats, flowState.startDate, setFlowState])

    useEffect(() => {
        // Controlliamo come prima cosa che lo state principale non abbia già dei valori.
        // Se li ha non serve proseguire, perché diamo per buoni i valori dello state principale.
        // Altrimenti verifichiamo se nel cambio di route sono stati passati dei valori iniziali.
        if (flowState.firstRunCompleted) return;
        if (!location.state) return;
        if (flowState.startDate !== "" || flowState.endDate !== "") return;

        const {searched_start_date, searched_end_date, searched_seats} = location.state;
        if (!searched_start_date || !searched_end_date || isNaN(searched_seats)) return;

        console.log("ci rientro?")
        setFlowState(prevState => ({
            ...prevState,
            startDate: searched_start_date,
            endDate: searched_end_date,
            seats: searched_seats,
        }));
    }, [boats, flowState.endDate, flowState.firstRunCompleted, flowState.seats, flowState.startDate, handleSearch, location.state, setFlowState]);

    useEffect(() => {
        if (flowState.startDate === "") return;
        if (flowState.endDate === "") return;
        if (!flowState.firstRunCompleted) {
            handleSearch();

            setFlowState(prevState => ({
                ...prevState,
                firstRunCompleted: true,
            }));
        }
    }, [flowState, flowState.endDate, flowState.firstRunCompleted, flowState.startDate, handleSearch, setFlowState]);

    /**
     * Se ChangeBoat è stato flaggato a True, facciamo la ricerca con i valori precedenti
     * Cosi da consentire all'utente di selezioanre una imbarcazione differente.
     */
    useEffect(() => {
        if (flowState.changeBoat) {
            console.log(
                "flowState.changeBoat", flowState.changeBoat)
            handleSearch();
        }
    }, [flowState.changeBoat, handleSearch]);


    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <section className="pt-10 pb-6">
                <h1 className="text-2xl font-bold text-[#0A1F44] mb-4 font-sans">
                    Modifica i parametri di ricerca
                </h1>

                <SearchForm
                    flowState={flowState}
                    setFlowState={setFlowState as React.Dispatch<React.SetStateAction<BookingSearchFields>>}
                    getAvailabilities={handleSearch}
                />
            </section>

            <section className="mt-12 mb-6">
                <h2 className="font-serif text-[#0A1F44] font-bold text-3xl mb-2">
                    Risultati della tua ricerca
                </h2>
            </section>

            {isLoading && (
                <p className="text-[#0A1F44] text-lg text-center py-10">Caricamento imbarcazioni...</p>
            )}

            {!isLoading && boats && boats?.data?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {boats.data.map((boat) => (
                        <BoatCard
                            key={boat.id}
                            boat={boat}
                            showSelection={true}
                            setFlowState={setFlowState}
                        />
                    ))}
                </div>
            )}
            {!isLoading && (!boats || boats?.data.length === 0) && (
                <p className="text-left text-xl text-[#0A1F44] mb-12">
                    {
                        flowState.startDate && flowState.endDate && flowState.searchAttempt &&
                        messages.NOT_FOUND
                    }

                    {
                        flowState.startDate && flowState.endDate && !flowState.searchAttempt &&
                        messages.CHANGE_DATE_AND_SEARCH

                    }

                    {
                        !flowState.startDate && !flowState.endDate &&
                        messages.ENTER_DATE_TO_SERACH
                    }
                </p>
            )}
        </div>
    );
};

export default BookingFlowSearchStep;