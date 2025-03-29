import * as React from "react";
import {useEffect, useState} from "react";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import BoatCard from "../../components/Card/BoatCard.tsx";
import SearchForm from "../../components/Booking/SearchForm.tsx";
import {useSearchParams} from "react-router-dom";
import {DateTime} from "luxon";
import BoatService from "../../services/Boat/BoatService.ts";
import {SearchAvailableBoatsRequest} from "../../models/request/SearchAvailableBoatsRequest.ts";
import Spinner from "../../components/Layout/Spinner.tsx";

const SearchAvailability: React.FC = () => {
    const [boats, setBoats] = useState<BoatResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [startDate, setStartDate] = useState<string>(searchParams.get("start_date") || "");
    const [endDate, setEndDate] = useState<string>(searchParams.get("end_date") || "");
    const [seats, setSeats] = useState<number>(Number(searchParams.get("seats") || 1));

    useEffect(() => {
        if (!startDate || !endDate || isNaN(seats)) return;
        setIsLoading(true);
        const SearchRequest: SearchAvailableBoatsRequest = {
            start_date: startDate,
            end_date: endDate,
            seat: seats,
        }
        BoatService.searchAvailableBoats(SearchRequest).then((boats) => {
            setBoats(boats);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    }, [endDate, seats, startDate])

    const beautifyDatetime = (date: string | null) => {
        if (!date) {
            return "Error"
        }
        return DateTime.fromFormat(date, "yyyy-MM-dd HH:mm").toFormat("dd/MM/yyyy HH:mm");
    }

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <section className="pt-8 pb-4">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-[#0A1F44] mb-4 text-left">Modifica i parametri di
                        ricerca</h1>
                    <SearchForm
                        initialStartDate={startDate ?? ""}
                        initialEndDate={endDate ?? ""}
                        initialSeats={seats || 1}
                        showFull={true}
                        setSearchStartDate={setStartDate}
                        setSearchEndDate={setEndDate}
                        setSearchSeats={setSeats}
                    />
                </div>
            </section>

            <div className="text-left my-12 mb-12">
                <h2 className={"font-serif text-[#0A1F44] font-bold text-3xl"}>
                    Risultati della tua ricerca
                </h2>
                <p className={"text-[#0A1F44] mt-4 text-md"}>
                    Ecco le imbarcazioni disponibili
                    dal <strong>{beautifyDatetime(startDate)}</strong> al <strong>{beautifyDatetime(endDate)}</strong> per <strong>{seats}</strong> persone.
                </p>
            </div>

            {isLoading && "Caricamento..."}

            {!isLoading && boats && boats?.data?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {boats.data.map((boat) => (
                        <BoatCard key={boat.id} boat={boat} showSelection={true}/>
                    ))}
                </div>
            )}

            {!isLoading && (!boats || boats.data.length === 0) && (
                <p className="text-center text-xl text-[#0A1F44] mb-12">
                    Nessuna imbarcazione disponibile per i criteri selezionati.
                </p>
            )}
        </div>
    );
};

export default SearchAvailability;