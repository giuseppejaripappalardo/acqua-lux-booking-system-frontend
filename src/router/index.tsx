import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginLayout from "../layout/Login/LoginLayout.tsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.tsx";
import LoginPage from "../pages/Login/LoginPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element:
            <ProtectedRoute>
                <div><h1>Hello World</h1></div>
            </ProtectedRoute>
    },
    {
        Component: LoginLayout,
        children: [
            {path: "/Login", Component: LoginPage}
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>
}