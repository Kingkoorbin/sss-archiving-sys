import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/login.auth";
import Register from "./pages/authentication/register.auth";
import RegisterRole from "./pages/authentication/register-role.auth";
import CreateTenantProfile from "./pages/tenant/create-profile.tenant";
import CreateUserProfile from "./pages/user/create-profile.user";
import CreateAdminProfile from "./pages/admin/create-profile.admin";
import PaymentSuccess from "./pages/payment/success.payment";
import PaymentCancelled from "./pages/payment/cancelled.payment";

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
    {
        path: "/payment/success",
        element: <PaymentSuccess />,
    },
    {
        path: "/payment/cancelled",
        element: <PaymentCancelled />,
    },
]);