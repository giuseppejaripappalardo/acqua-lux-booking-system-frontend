import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import BoatCard from "../../components/Card/BoatCard.tsx";
import SearchForm from "../../components/Booking/SearchForm.tsx";
import BoatService from "../../services/Boat/BoatService.ts";
import {BookingSearchFields} from "../../models/object/Bookings.ts";
import {DateTime} from "luxon";
import {stateStdDatetimeFormat, tzEuropeRome} from "../../utils/DatetimeUtil.ts";

const BookingPage: React.FC = () => {
    const now = DateTime.now().setZone(tzEuropeRome);
    const today = now.plus({hour: 2}).toFormat(stateStdDatetimeFormat);

    const [boats, setBoats] = React.useState<BoatResponse>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [flowState, setFlowState] = useState<BookingSearchFields>({
        startDate: today,
        endDate: "",
        seats: 1,
    })

    const retrieveBoats = useCallback(() => {
        setIsLoading(true);
        BoatService.getList().then((boats) => {
            setBoats(boats);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    }, [])

    useEffect(() => {
        retrieveBoats()
    }, [retrieveBoats]);

    // if (isLoading) {
    //     return <Spinner/>;
    // }

    return (
        <div>
            <section
                className="relative h-[65vh] bg-background md:bg-[url('./../../assets/images/yacht_luxury.jpg')] bg-center bg-cover rounded-md">
                <div className="absolute inset-0 bg-black/40 rounded-md"/>
                <div
                    className="relative z-10 h-full flex flex-col justify-center md:justify-end items-center text-center text-white px-4">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
                        <span className={"font-serif"}>Acqua<span className={"text-[#D4AF37]"}>Lux</span></span>
                    </h1>
                    <p className="max-w-xl text-white/90 mb-6">
                        Prenota con pochi clic.
                    </p>
                    <SearchForm flowState={flowState} setFlowState={setFlowState}/>
                </div>
            </section>
            <div className="text-left my-12 mb-12">
                <h2 className={"font-serif text-[#0A1F44] font-bold text-3xl"}>
                    Esplora il nostro catalogo di imbarcazioni di lusso
                </h2>
                <p className={"text-[#0A1F44] mt-4 text-md"}>
                    Scegli tra yacht esclusivi e imbarcazioni raffinate per vivere il mare con stile, comfort e
                    un'eleganza senza tempo.
                </p>
            </div>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:my-15 sm:my-10 mb-12">
                {
                    !isLoading && boats &&
                    boats?.data.map(boat => <BoatCard key={boat.id} boat={boat}/>)
                }

                {
                    !isLoading && !boats &&
                    <p className="text-center text-xl text-[#0A1F44]">
                        Non ci sono imbarcazioni disponibili.
                    </p>
                }

                {
                    isLoading &&
                    "Caricamento catalogo..."
                }
            </div>
        </div>
    )
}

export default BookingPage;