import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './index.css';
// Pages
import Login from './pages/login/login.page';
import AdminDashboard from './pages/dashboard/admin-dashboard.page';
import StaffDashboard from './pages/dashboard/staff-dashboard.page';
import AdminAccountManagement from './pages/dashboard/admin-account-mgmt.page';
import AdminRequests from './pages/dashboard/admin-requests.page';
import AdminContributionRecord from './pages/dashboard/admin-contribution-record.page';
import AdminActivityLogs from './pages/dashboard/admin-activity-logs.page';
import AdminAccountEdit from './pages/dashboard/admin-account-edit.page';
import RequestPage from './pages/dashboard/request.page';
import AdminEmployeeRegistration from './pages/dashboard/admin-employee-registration.page';
import AdminEmployeeEdit from './pages/dashboard/admin-employee-edit.page';
import AdminEmployeeList from './pages/dashboard/admin-employee-list.page';
import AdminStaffList from './pages/dashboard/admin-staff-list.page';
import AdminStaffRegistration from './pages/dashboard/admin-staff-registration.page';
import AdminEmployeePreview from './pages/dashboard/admin-employee-preview.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/request',
    element: <RequestPage />,
  },
  {
    path: '/dashboard/a',
    element: <AdminDashboard />,
  },
  {
    path: '/dashboard/a/account-management',
    element: <AdminAccountManagement />,
  },
  {
    path: '/dashboard/a/account-management/:id/edit',
    element: <AdminAccountEdit />,
  },
  {
    path: '/dashboard/a/account-management/employee/create',
    element: <AdminEmployeeRegistration />,
  },
  {
    path: '/dashboard/a/account-management/staff/create',
    element: <AdminStaffRegistration />,
  },
  {
    path: '/dashboard/a/account-management/employee/:id/edit',
    element: <AdminEmployeeEdit />,
  },
  {
    path: '/dashboard/a/employee',
    element: <AdminEmployeeList />,
  },
  {
    path: '/dashboard/a/employee/:id',
    element: <AdminEmployeePreview />,
  },
  
  {
    path: '/dashboard/a/staff',
    element: <AdminStaffList />,
  },
  {
    path: '/dashboard/a/requests',
    element: <AdminRequests />,
  },
  {
    path: '/dashboard/a/contributions',
    element: <AdminContributionRecord />,
  },
  {
    path: '/dashboard/a/activities',
    element: <AdminActivityLogs />,
  },
  {
    path: '/dashboard/s',
    element: <StaffDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ConfigProvider theme={{ token: { colorPrimary: '#ED0779' } }}>
    <RouterProvider router={router} />
  </ConfigProvider>
  // </React.StrictMode>
);
