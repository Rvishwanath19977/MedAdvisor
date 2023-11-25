import React from 'react';
import { useAuth } from './web/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './web/Design/Navbar';
import Login from './web/cmpts/Login';
import Patient from './web/Users/Patient';
import Doctor from './web/Users/Doctor';
import Admin from './web/Users/Admin';
import Register from './web/cmpts/Register';

const PrivateRoute = ({ role, element }) => {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/login/" replace />;
  }
  return element;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient/*" element={<PrivateRoute role="patient" element={<Patient />} />} />
        <Route path="/doctor/*" element={<PrivateRoute role="doctor" element={<Doctor />} />} />
        <Route path="/admin/*" element={<PrivateRoute role="admin" element={<Admin />} />} />
      </Routes>
    </Router>
  );
};

export default App;
