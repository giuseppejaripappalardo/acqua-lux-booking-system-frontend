import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import DashboardLayout from "../layout/DashboardLayout.tsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.tsx";
import MyBookingsPage from "../pages/MyBookings/MyBookingsPage.tsx";
import BookingPage from "../pages/Booking/BookingPage.tsx";
import BookingFlowPage from "../pages/BookingFlowPage/BookingFlowPage.tsx";
import EditBookingFlowPage from "../pages/EditBookingFlowPage/EditBookingFlowPage.tsx";

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
                    <BookingFlowPage/>
                </ProtectedRoute>,
            },
            {
                path: "/edit-booking/:id",
                element: <ProtectedRoute>
                    <EditBookingFlowPage/>
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
        path: "/Login",
        element:
            <ProtectedRoute>
                <LoginPage/>
            </ProtectedRoute>
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>
}