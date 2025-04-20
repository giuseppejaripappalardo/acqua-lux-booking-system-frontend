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
                element: <ProtectedRoute render={() => <BookingPage/>}/>
            },
            {
                path: "/search-availability",
                element: <ProtectedRoute render={() => <BookingFlowPage/>}/>
            },
            {
                path: "/edit-booking/:id",
                element: <ProtectedRoute render={() => <EditBookingFlowPage/>}/>
            },
            {
                path: "/my-bookings",
                element: <ProtectedRoute render={() => <MyBookingsPage/>}/>
            }
        ]
    },
    {
        path: "/Login",
        element:  <ProtectedRoute render={() => <LoginPage/>}/>
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>
}