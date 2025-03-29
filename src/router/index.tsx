import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import DashboardLayout from "../layouts/DashboardLayout.tsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.tsx";
import MyBookingsPage from "../pages/MyBookings/MyBookingsPage.tsx";
import BookingPage from "../pages/Booking/BookingPage.tsx";
import BoatService from "../services/Boat/BoatService.ts";

const router = createBrowserRouter([
    {
        Component: DashboardLayout,
        children: [
            {
                index: true,
                path: "/",
                element: <ProtectedRoute>
                    <BookingPage/>
                </ProtectedRoute>,
                loader: async () => {
                    return BoatService.getList();
                },
                errorElement: <div>Error</div>,
            },
            {
                path: "/my-bookings",
                element: <ProtectedRoute>
                    <MyBookingsPage/>
                </ProtectedRoute>,
            }
        ]
    },
    {
        index: true,
        path: "/Login", Component: LoginPage
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>
}