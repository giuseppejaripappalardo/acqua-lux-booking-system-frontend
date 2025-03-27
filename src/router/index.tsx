import {createBrowserRouter, RouterProvider} from "react-router-dom";
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
        path: "/Login", Component: LoginPage,
        action: async ({request}) => {
            const formData = await request.formData();
            console.log(formData)
        }
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>
}