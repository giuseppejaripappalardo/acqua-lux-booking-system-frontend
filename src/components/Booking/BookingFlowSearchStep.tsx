import SearchForm from "./SearchForm.tsx";
import BoatCard from "../Card/BoatCard.tsx";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import {useLocation} from "react-router-dom";
import {BookingFlowState} from "../../pages/BookingFlowPage/BookingFlowPage.tsx";
import {BookingSearchFields} from "../../models/object/Bookings.ts";
import {
    EditSearchAvailableBoatsRequest,
    SearchAvailableBoatsRequest
} from "../../models/request/SearchAvailableBoatsRequest.ts";
import BoatService from "../../services/Boat/BoatService.ts";

interface BookingFlowSearchStepProps {
    setFlowState: React.Dispatch<React.SetStateAction<BookingFlowState>>;
    flowState: BookingFlowState;
}

const messages = {
    ENTER_DATE_TO_SERACH: "Inserisci la data di inizio e fine per effettuare la ricerca delle disponibilità.",
    CHANGE_DATE_AND_SEARCH: "Cambia le date e clicca sul tasto cerca per verificare le disponibilità.",
    NOT_FOUND: "Nessuna imbarcazione disponibile per i criteri selezionati.",
    EDIT_MODE_MESSAGE: "Inserisci le date, verifica la disponibilità per procedere alla modifica richiesta."
}

const BookingFlowSearchStep: React.FC<BookingFlowSearchStepProps> = ({setFlowState, flowState}) => {

    const [boats, setBoats] = useState<BoatResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resultMessage, setResultMessage] = useState<string>(flowState.isEditMode ? messages.EDIT_MODE_MESSAGE : messages.ENTER_DATE_TO_SERACH);
    const location = useLocation();


    const handleSearch = useCallback(() => {
        if (flowState.startDate === "" || flowState.endDate === "" || isNaN(flowState.seats)) return;
        if (!flowState?.originalBooking?.id) return;
        setIsLoading(true);
        const SearchRequest: EditSearchAvailableBoatsRequest = {
            start_date: flowState.startDate,
            end_date: flowState.endDate,
            seat: flowState.seats,
            booking_id: flowState.originalBooking.id,
        }
        BoatService.editSearchAvailableBoats(SearchRequest).then((boats) => {
            setBoats(boats);
            setIsLoading(false);
            if (boats && boats.data.length === 0) {
                setResultMessage(messages.NOT_FOUND);
            }
        }).catch((err) => {
            setFlowState(prevState => ({
                ...prevState,
                showErrorModal: true,
                modalErrorMsg: err.message,
            }));
        }).finally(() => {
            setIsLoading(false);
        })
        setFlowState(prevState => ({
            ...prevState,
            searchAttempt: true,
            changeBoat: false,
        }))
    }, [flowState, setFlowState])

    useEffect(() => {
        // Controlliamo come prima cosa che lo state principale non abbia già dei valori.
        // Se li ha non serve proseguire, perché diamo per buoni i valori dello state principale.
        // Altrimenti verifichiamo se nel cambio di route sono stati passati dei valori iniziali.
        if (flowState.firstRunCompleted) return;
        if (!location.state) return;
        if (flowState.startDate !== "" || flowState.endDate !== "") return;

        const {searched_start_date, searched_end_date, searched_seats} = location.state;
        if (!searched_start_date || !searched_end_date || isNaN(searched_seats)) return;

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
        console.log("Mi fermo qua")
        if (flowState.isEditMode) return;
        console.log("sono oltre l'edit mode.")
        if (!flowState.firstRunCompleted) {
            console.log("ci sto entrando come è corretto che sia!")
            handleSearch();

            setFlowState(prevState => ({
                ...prevState,
                firstRunCompleted: true,
            }));
        }
    }, [flowState.isEditMode, flowState.endDate, flowState.firstRunCompleted, flowState.startDate, handleSearch, setFlowState]);

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
        <div className="w-full mx-auto px-4">
            <section className="pt-10 pb-6">
                <h1 className="text-2xl font-bold text-[#0A1F44] mb-4 font-sans">
                    Modifica i parametri di ricerca
                </h1>

                <SearchForm
                    flowState={flowState}
                    setFlowState={setFlowState as React.Dispatch<React.SetStateAction<BookingSearchFields>>}
                    getAvailabilities={handleSearch}
                    bgDark={true}
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
                    {resultMessage}
                </p>
            )}
        </div>
    );
};

export default BookingFlowSearchStep;