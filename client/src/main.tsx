import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";

// Pages
import Login from "./pages/login/login.page";
import AdminDashboard from "./pages/dashboard/admin-dashboard.page";
import StaffDashboard from "./pages/dashboard/staff-dashboard.page";
// import AdminDashboard from './pages/dashboard/dasbhoard.page';
// import UsersActivity from './pages/dashboard/activity.page';
// import Users from './pages/dashboard/users.page';
// import Requests from './pages/dashboard/requests.page';
// import PreviewRecords from './pages/dashboard/records.page';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/dashboard/a",
        element: <AdminDashboard />,
    },
    {
        path: "/dashboard/s",
        element: <StaffDashboard />,
    },
    // {
    //   path: '/a/dashboard',
    //   element: <AdminDashboard />,
    // },
    // {
    //   path: '/a/activities',
    //   element: <UsersActivity />,
    // },
    // {
    //   path: '/a/users',
    //   element: <Users />,
    // },
    // {
    //   path: '/a/requests',
    //   element: <Requests />,
    // },
    // {
    //   path: '/a/users/record',
    //   element: <PreviewRecords />,
    // },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: "#ED0779" } }}>
        <RouterProvider router={router} />
    </ConfigProvider>,
    // </React.StrictMode>
);
