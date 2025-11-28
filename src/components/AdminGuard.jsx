import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';

const ADMIN_EMAIL = 'gustavomatheus2812@gmail.com';

const AdminGuard = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.email !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminGuard;
