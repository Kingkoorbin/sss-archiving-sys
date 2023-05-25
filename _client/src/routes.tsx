import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/login.auth";
import Register from "./pages/authentication/register.auth";
import RegisterRole from "./pages/authentication/register-role.auth";
import CreateTenantProfile from "./pages/tenant/create-profile.tenant";
import CreateUserProfile from "./pages/user/create-profile.user";
import CreateAdminProfile from "./pages/admin/create-profile.admin";

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
    {
        path: "/profile/tenant/create",
        element: <CreateTenantProfile />,
    },
    {
        path: "/profile/user/create",
        element: <CreateUserProfile />,
    },
    {
        path: "/profile/admin/create",
        element: <CreateAdminProfile />,
    },
]);