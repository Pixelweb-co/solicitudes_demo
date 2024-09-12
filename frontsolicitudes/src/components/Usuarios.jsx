import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import RegistroForm from './RegistroForm'; // Asegúrate de que el nombre del formulario coincida con el que estás utilizando
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function InputGroup7({ label, name, value, onChange, type = "text", decoration, className = "", inputClassName = "", decorationClassName = "", disabled }) {
  return (
    <div className={`flex items-center w-full bg-white shadow-md rounded-lg ${className}`}>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
        className={`w-full p-3 text-gray-600 focus:outline-none ${disabled ? "bg-gray-200" : ""} ${inputClassName}`}
        disabled={disabled}
      />
      <div className={`flex items-center p-3 text-gray-600 ${disabled ? "bg-gray-200" : ""} ${decorationClassName}`}>
        {decoration}
      </div>
    </div>
  );
}

function Button2({ content, onClick, active, disabled }) {
  return (
    <button
      className={`flex items-center justify-center w-9 h-9 shadow-md text-sm font-normal transition-colors rounded-lg ${active ? "bg-red-500 text-white" : "text-red-500"} ${!disabled ? "bg-white hover:bg-red-500 hover:text-white" : "text-red-300 bg-white cursor-not-allowed"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

function PaginationNav1({ gotoPage, canPreviousPage, canNextPage, pageCount, pageIndex }) {
  const renderPageLinks = () => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 3;
    let numberOfButtons = pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;
    [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1;
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
      if (pageNumberBefore >= 0 && (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });
    return pageIndices.map((pageIndexToMap) => (
      <li key={pageIndexToMap}>
        <Button2
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap)}
          active={pageIndex === pageIndexToMap}
        />
      </li>
    ));
  };

  return (
    <ul className="flex gap-2">
      <li>
        <Button2
          content={<div className="flex ml-1"><FaChevronLeft size="0.6rem" /><FaChevronLeft size="0.6rem" className="-translate-x-1/2" /></div>}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        />
      </li>
      {renderPageLinks()}
      <li>
        <Button2
          content={<div className="flex ml-1"><FaChevronRight size="0.6rem" /><FaChevronRight size="0.6rem" className="-translate-x-1/2" /></div>}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />
      </li>
    </ul>
  );
}

function Usuarios() {
  const [users, setUsers] = useState([]);
  const { token } = useAuth(); // Obtener el token desde el contexto
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Función para obtener la lista de usuarios desde la API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Llama a la función fetchUsers al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Función para manejar el botón de "Nuevo usuario"
  const handleAddUser = () => {
    setSelectedUser(null); // Limpia cualquier usuario seleccionado previo
    setShowForm(true); // Muestra el formulario
  };

  // Función para manejar la edición de un usuario
  const handleEditUser = (user) => {
    setSelectedUser(user); // Establece el usuario seleccionado
    setShowForm(true); // Muestra el formulario
  };

  // Función para manejar el cierre del formulario
  const handleCloseForm = () => {
    setShowForm(false); // Oculta el formulario
    setSelectedUser(null); // Limpia el usuario seleccionado
  };

  // Función para manejar la acción de guardar (ya sea agregar o actualizar un usuario)
  const handleSave = () => {
    fetchUsers(); // Actualiza la lista de usuarios después de agregar o actualizar
  };

  // Función para manejar la eliminación de un usuario
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      fetchUsers(); // Actualiza la lista de usuarios después de eliminar
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      <button
        type='button'
        onClick={handleAddUser}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Nuevo usuario
      </button>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.rol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    type='button'
                    onClick={() => handleEditUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <RegistroForm user={selectedUser} onClose={handleCloseForm} onSave={handleSave} />}
    </div>
  );
}

export default Usuarios;
