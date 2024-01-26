import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './index.css';

// Pages
import Login from './pages/login/login.page';
import AdminDashboard from './pages/dashboard/admin/admin-dashboard.page';
import AdminRequests from './pages/dashboard/admin/admin-requests.page';
import AdminContributionRecord from './pages/dashboard/admin/admin-contribution-record.page';
import AdminActivityLogs from './pages/dashboard/admin/admin-activity-logs.page';
import RequestPage from './pages/dashboard/request.page';
import AdminEmployeeRegistration from './pages/dashboard/admin/admin-employee-registration.page';
import AdminEmployeeEdit from './pages/dashboard/admin/admin-employee-edit.page';
import AdminEmployeeList from './pages/dashboard/admin/admin-employee-list.page';
import AdminStaffList from './pages/dashboard/admin/admin-staff-list.page';
import AdminStaffRegistration from './pages/dashboard/admin/admin-staff-registration.page';
import AdminEmployeePreview from './pages/dashboard/admin/admin-employee-preview.page';
import StaffContributionRecord from './pages/dashboard/staff/staff-contribution-record.page';
import StaffEmployeeList from './pages/dashboard/staff/staff-employee-list.page';
import StaffEmployeePreview from './pages/dashboard/staff/staff-employee-preview.page';
import StaffRequests from './pages/dashboard/staff/staff-requests.page';
import StaffEmployeeEdit from './pages/dashboard/staff/admin-employee-edit.page';

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
    path: '/dashboard/s/employee',
    element: <StaffEmployeeList />,
  },
  {
    path: '/dashboard/a/employee/:id',
    element: <AdminEmployeePreview />,
  },
  {
    path: '/dashboard/s/employee/:id',
    element: <StaffEmployeePreview />,
  },
  {
    path: '/dashboard/a/staff',
    element: <AdminStaffList />,
  },
  {
    path: '/dashboard/s/contribution',
    element: <StaffContributionRecord />,
  },
  {
    path: '/dashboard/a/requests',
    element: <AdminRequests />,
  },
  {
    path: '/dashboard/s/requests',
    element: <StaffRequests />,
  },
  {
    path: '/dashboard/a/contribution',
    element: <AdminContributionRecord />,
  },
  {
    path: '/dashboard/a/activities',
    element: <AdminActivityLogs />,
  },
  {
    path: '/dashboard/s/account-management/employee/:id/edit',
    element: <StaffEmployeeEdit />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ConfigProvider theme={{ token: { colorPrimary: '#ED0779' } }}>
    <RouterProvider router={router} />
  </ConfigProvider>
  // </React.StrictMode>
);
