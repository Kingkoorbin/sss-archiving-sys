import React, { useState } from 'react';
import {
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState('home');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Requests',
      icon: <MailOutlined />,
      key: 'item-requests',
      style: {
        color: location.pathname === '/dashboard/a/requests' ? '#111' : '#999',
      },
      onClick: () => navigate('/dashboard/a/requests', { replace: true }),
    },
    {
      label: 'SSS Contributions',
      key: 'item-soa',
      icon: <CalendarOutlined />,
      style: {
        color:
          location.pathname === '/dashboard/a/contribution' ? '#111' : '#999',
      },
      onClick: () => navigate('/dashboard/a/contribution', { replace: true }),
    },
    {
      label: 'Employeee Management',
      key: 'item-employee-mgmt',
      icon: <UserAddOutlined />,
      style: {
        color: location.pathname === '/dashboard/a/employee' ? '#111' : '#999',
      },
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Employees',
              key: 'item-employee-mgmt:1',
              onClick: () =>
                navigate('/dashboard/a/employee', { replace: true }),
            },
            {
              label: 'Add Employee',
              key: 'item-employee-mgmt:2',
              onClick: () =>
                navigate('/dashboard/a/account-management/employee/create'),
            },
          ],
        },
      ],
    },
    {
      label: 'Staff Management',
      key: 'item-staff-mgmt',
      icon: <UserAddOutlined />,
      style: {
        marginRight: 'auto',
        color: location.pathname === '/dashboard/a/staff' ? '#111' : '#999',
      },
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Staffs',
              key: 'item-staff-mgmt:1',
              onClick: () => navigate('/dashboard/a/staff', { replace: true }),
            },
            {
              label: 'Add Staffs',
              key: 'item-staff-mgmt:2',
              onClick: () =>
                navigate('/dashboard/a/account-management/staff/create'),
            },
            {
                label: 'Signatories',
                key: 'item-staff-mgmt:2',
                onClick: () =>
                  navigate('/dashboard/a/account-management/staff/create'),
              },
          ],
        },
      ],
    },
    {
      label: 'Activity Logs',
      icon: <FieldTimeOutlined />,
      key: 'item-activity-logs',
      style: {
        color:
          location.pathname === '/dashboard/a/activities' ? '#111' : '#999',
      },
      onClick: () => navigate('/dashboard/a/activities', { replace: true }),
    },
    {
      label: 'Settings',
      key: 'SettingsMenu',
      icon: <SettingOutlined />,
      style: {
        color: '#999',
      },
      children: [
        {
          type: 'group',
          label: 'Account',
          children: [
            {
              label: 'Change Password',
              key: 'setting:3',
              disabled: true,
            },
          ],
        },
        {
          type: 'group',
          label: 'System',
          children: [
            {
              label: 'Maintenance Mode',
              key: 'setting:1',
              disabled: true,
            },
            {
              label: 'Sign out',
              key: 'setting:2',
              onClick: () => navigate('/', { replace: true }),
            },
          ],
        },
      ],
    },
  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default AdminNavbar;
