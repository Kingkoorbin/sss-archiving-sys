import React, { useState } from 'react';
import {
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
  TeamOutlined,
  FieldTimeOutlined,
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
    // {
    //     label: "Dashboard",
    //     key: "item-dashboard",
    //     style: {
    //         color: location.pathname === "/dashboard/a"
    //             ? "#111"
    //             : "#999",
    //     },
    //     onClick: () => navigate("/dashboard/a", { replace: true }),
    // },
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
      label: 'SSS Contributionss',
      key: 'item-soa',
      icon: <CalendarOutlined />,
      style: {
        marginRight: 'auto',
        color:
          location.pathname === '/dashboard/a/contributions' ? '#111' : '#999',
      },
      onClick: () => navigate('/dashboard/a/contributions', { replace: true }),
    },

    {
      label: 'Account Management',
      icon: <TeamOutlined />,
      key: 'item-active-users',
      style: {
        color:
          location.pathname === '/dashboard/a/account-management'
            ? '#111'
            : '#999',
      },
      onClick: () =>
        navigate('/dashboard/a/account-management', { replace: true }),
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
