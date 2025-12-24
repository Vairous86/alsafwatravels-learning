import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default RequireAuth;