import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('token'); // Check for token in localStorage

    if (!isAuthenticated) {
        // Redirect them to the /login page if not logged in
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default PrivateRoute;
