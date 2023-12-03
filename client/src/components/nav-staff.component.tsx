import React, { useState } from 'react';
import {
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const StaffNavbar: React.FC = () => {
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
        color: location.pathname === '/dashboard/s/requests' ? '#111' : '#999',
      },
      onClick: () => navigate('/dashboard/s/requests', { replace: true }),
    },
    {
      label: 'SSS Contributions',
      key: 'item-soa',
      icon: <CalendarOutlined />,
      style: {
        color:
          location.pathname === '/dashboard/s/contribution' ? '#111' : '#999',
      },
      onClick: () => navigate('/dashboard/s/contribution', { replace: true }),
    },
    {
      label: 'Employeees',
      key: 'item-employees',
      icon: <UserAddOutlined />,
      style: {
        color: location.pathname === '/dashboard/s/employee' ? '#111' : '#999',
        marginRight: 'auto',
      },
      onClick: () => navigate('/dashboard/s/employee', { replace: true }),
    },
    {
      label: 'Sign out',
      key: 'SignOut',
      icon: <LogoutOutlined />,
      style: {
        color: '#999',
      },
      onClick: () => navigate('/', { replace: true }),
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

export default StaffNavbar;
