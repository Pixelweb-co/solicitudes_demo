import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginLayout from './components/LoginLayout';
import MainLayout from './components/MainLayout';
import RegistroForm from './components/RegistroForm';
import EmployeeTable from './components/Empleados';
import Requests from './components/Solicitudes';
import Users from './components/Usuarios';
import { useAuth } from './context/authcontext'; // Importar el hook useAuth

function App() {
  const { token } = useAuth(); // Obtener el token desde el contexto

  return (
    <Router>
      <Routes>
        {/* Redirige a /login si el token no existe */}
        <Route path="/" element={token ? <Navigate to="/principal" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginLayout />} />
        {/* Redirige a /login si el token no existe, o muestra MainLayout si el token existe */}
        
        <Route path="/registro" element={<RegistroForm />} />

        <Route
          path="/principal"
          element={token ? <MainLayout /> : <Navigate to="/login" />}
        >
          {/* Rutas anidadas dentro de MainLayout */}
          <Route path="empleados" element={<EmployeeTable />} />
          <Route path="solicitudes" element={<Requests />} />
          <Route path="usuarios" element={<Users />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
