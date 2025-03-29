import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import DashboardLayout from "../layouts/DashboardLayout.tsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.tsx";
import MyBookingsPage from "../pages/MyBookings/MyBookingsPage.tsx";

const router = createBrowserRouter([
    {
        Component: DashboardLayout,
        children: [
            {
                index: true,
                path: "/",
                element: <ProtectedRoute>
                    <div>Hello world!</div>
                </ProtectedRoute>
            },
            {
                path: "/my-bookings",
                element: <ProtectedRoute>
                    <MyBookingsPage/>
                </ProtectedRoute>
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