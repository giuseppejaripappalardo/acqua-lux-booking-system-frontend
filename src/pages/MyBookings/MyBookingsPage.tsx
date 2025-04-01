import * as React from "react";
import {useEffect, useState} from "react";
import {BookingWithBoat} from "../../models/response/BookingResponse";
import BookingService from "../../services/Booking/BookingService.ts";
import Spinner from "../../components/Layout/Spinner.tsx";
import BookingCard from "../../components/Booking/BookingCard.tsx";
import AppModal, {AppModalProps} from "../../components/Modal/AppModal.tsx";


const MyBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingWithBoat[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [appModal, setAppModal] = useState<AppModalProps>({
        open: false,
        onClose: () => {
            setAppModal(prevState => (
                    {
                        ...prevState,
                        title: "",
                        message: "",
                        hideCloseButton: false,
                        primaryButton: null,
                        open: false,
                    }
                )
            );
        },
        title: "",
        message: "",
        hideCloseButton: false,
        primaryButton: null,
    });
    const itemsPerPage = 10;

    const handleGetBookingList = (): void => {
        setIsLoading(true);
        BookingService.getReservations()
            .then((bookings) => {
                setBookings(bookings.data);
            })
            .catch(() => {

            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        handleGetBookingList()
    }, []);

    useEffect(() => {
        console.log("Sono false");
        if (refreshList) {
            console.log("sono true e ora mi rimetto a false ;)");
            handleGetBookingList()
            setRefreshList(false);
        }
    }, [refreshList]);

    const paginated = bookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pt-10 pb-16">
            <h1 className="text-3xl font-serif font-bold text-[#0A1F44] mb-6">
                Le mie prenotazioni
            </h1>

            {
                paginated.length === 0 && !isLoading ? (
                    <p className="text-gray-600">Non hai ancora effettuato prenotazioni.</p>
                ) : (
                    <div className="space-y-6">
                        {paginated.map(
                            (booking) => (
                                <BookingCard booking={booking} key={booking.id} setModal={setAppModal} setRefreshList={setRefreshList}/>
                            )
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-center pt-6 gap-2">
                                {Array.from({length: totalPages}, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 text-sm font-medium rounded-full ${
                                            currentPage === i + 1
                                                ? "bg-[#D4AF37] text-white"
                                                : "bg-gray-200 text-[#0A1F44] hover:bg-gray-300"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                )
            }

            <AppModal
                title={appModal.title}
                message={appModal.message}
                open={appModal.open}
                onClose={appModal.onClose}
                primaryButton={appModal.primaryButton}
            />

        </div>
    );
};

export default MyBookingsPage;