import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/login.auth";
import Register from "./pages/authentication/register.auth";
import RegisterRole from "./pages/authentication/register-role.auth";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/register/:email/role",
        element: <RegisterRole />,
    },
    {
        path: "/register/:email/:role/finish",
        element: <RegisterRole />,
    },
]);