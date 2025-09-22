import React from 'react';
import NotificacionScreen from '../components/NotificacionScreen';
import ProtectedRoute from './ProtectedRoute';

const NotificacionRoute = (props) => (
  <ProtectedRoute>
    <NotificacionScreen {...props} />
  </ProtectedRoute>
);

export default NotificacionRoute;
