import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import '../MainLayout.css';

function MainLayout() {
  const { logout } = useAuth(); // Usa el contexto para la función logout

  const handleLogout = () => {
    logout(); // Usa el contexto para manejar el logout
    window.location.href = '/login';
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Sidebar</h2>
        <button onClick={handleLogout}>Cerrar sesión</button>

        <ul>
          <li><Link to="empleados">Tabla de Empleados</Link></li>
          <li><Link to="solicitudes">Solicitudes</Link></li>
          <li><Link to="usuarios">Usuarios</Link></li>
        </ul>
      </div>
      <div className="content">
        <Outlet /> {/* Renderiza los componentes según la ruta */}
      </div>
    </div>
  );
}

export default MainLayout;
