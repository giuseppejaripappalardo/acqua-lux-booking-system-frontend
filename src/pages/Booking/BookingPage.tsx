import * as React from "react";
import {BoatResponse} from "../../models/response/BoatResponse.ts";
import {useLoaderData} from "react-router-dom";
import BoatCard from "../../components/Card/BoatCard.tsx";

const BookingPage: React.FC = () => {
    const boats: BoatResponse = useLoaderData();

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <section className="relative bg-[url('/images/hero-yacht.jpg')] bg-cover bg-center h-[60vh]">
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Naviga il lusso</h1>
                    {/*<SearchForm />*/}
                </div>
            </section>
            <div className="text-left my-12 mb-12">
                <h2 className={"font-serif text-[#0A1F44] font-bold text-3xl"}>
                    Scopri la tua prossima avventura sull'acqua!
                </h2>
                <p className={"text-[#0A1F44] mt-4 text-md"}>
                    Esplora il nostro catalogo di imbarcazioni di lusso e trova quella perfetta per vivere un'esperienza
                    indimenticabile.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:my-15 sm:my-10">
                {boats?.data.map(boat => <BoatCard boat={boat}/>)}
            </div>
        </div>
    )
}

export default BookingPage;