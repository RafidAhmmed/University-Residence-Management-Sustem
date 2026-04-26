import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <Loader className="animate-spin" size={48} color="#1d3557" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <Loader className="animate-spin" size={48} color="#1d3557" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <Loader className="animate-spin" size={48} color="#1d3557" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-danger mb-4 font-heading">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Admin privileges required.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};
