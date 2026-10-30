import React, { useEffect } from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { useNavigate } from '../router/Router';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Administration | IPM Motors Abidjan';
  }, []);

  return <AdminDashboard onBackToSite={() => navigate('/')} />;
};
