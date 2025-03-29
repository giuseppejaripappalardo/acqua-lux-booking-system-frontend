import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import DashboardLayout from "../layout/DashboardLayout.tsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.tsx";
import MyBookingsPage from "../pages/MyBookings/MyBookingsPage.tsx";
import BookingPage from "../pages/Booking/BookingPage.tsx";
import SearchAvailability from "../pages/SearchAvailability/SearchAvailability.tsx";

const router = createBrowserRouter([
    {
        Component: DashboardLayout,
        children: [
            {
                path: "/",
                element: <ProtectedRoute>
                    <BookingPage/>
                </ProtectedRoute>,
            },
            {
                path: "/search-availability",
                element: <ProtectedRoute>
                    <SearchAvailability/>
                </ProtectedRoute>,
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