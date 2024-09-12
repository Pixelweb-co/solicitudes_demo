import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import SolicitudForm from './SolicitudForm';
import { FaSearch, FaChevronDown, FaCheck, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Avatar({ src, alt = "avatar" }) {
  return (
    <img src={src} alt={alt} className="w-8 h-8 rounded-full object-cover" />
  );
}

function InputGroup7({
  label,
  name,
  value,
  onChange,
  type = "text",
  decoration,
  className = "",
  inputClassName = "",
  decorationClassName = "",
  disabled,
}) {
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

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { token, user } = useAuth(); // Obtener el token y el usuario desde el contexto

  // Función para obtener la lista de solicitudes desde la API
  const fetchSolicitudes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/solicitudes', {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    }
  };

  useEffect(() => {
    fetchSolicitudes(); // Obtener solicitudes al montar el componente
  }, [token]); // Dependencia del token para actualizar la solicitud si cambia

  const handleAddSolicitud = () => {
    if (user.rol === 'administrador') {
      setSelectedSolicitud(null);
      setShowForm(true);
    }
  };

  const handleEditSolicitud = (solicitud) => {
    if (user.rol === 'administrador') {
      setSelectedSolicitud(solicitud);
      setShowForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedSolicitud(null);
  };

  const handleSave = () => {
    // Actualiza la lista de solicitudes después de agregar o actualizar
    fetchSolicitudes();
  };

  const handleDeleteSolicitud = async (id) => {
    if (user.rol === 'administrador') {
      try {
        await axios.delete(`http://localhost:3000/api/solicitudes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        });
        // Actualiza la lista de solicitudes después de eliminar
        fetchSolicitudes();
      } catch (error) {
        console.error('Error al eliminar la solicitud:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Tabla de Solicitudes</h2>
      
      {user.rol === 'administrador' && (
        <button
          type='button'
          onClick={handleAddSolicitud}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Nueva Solicitud
        </button>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.numero}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{solicitud.numero}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solicitud.fecha.split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solicitud.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solicitud.estado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solicitud.empleado ? `${solicitud.empleado.nombres} ${solicitud.empleado.apellidos}` : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.rol === 'administrador' && (
                    <>
                      <button
                        type='button'
                        onClick={() => handleEditSolicitud(solicitud)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Actualizar
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDeleteSolicitud(solicitud.numero)} // Asegúrate de que el ID sea correcto
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <SolicitudForm solicitud={selectedSolicitud} onClose={handleCloseForm} onSave={handleSave} />}
    </div>
  );
}

export default Solicitudes;
