import React, { useMemo, Fragment, useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

// Componente SelectMenu1
function SelectMenu1({ value, setValue, options, className = "", disabled }) {
  const selectedOption = useMemo(
    () => options.find((o) => o.id === value),
    [options, value]
  );
  return (
    <Listbox value={value} onChange={setValue} disabled={disabled}>
      <div className={`relative w-full ${className}`}>
        <Listbox.Button
          className={`relative w-full  rounded-xl py-3 pl-3 pr-10 text-base text-gray-700 text-left shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none
            ${
              disabled
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white cursor-default"
            }
          `}
        >
          <span className="block truncate">{selectedOption ? selectedOption.caption : 'Seleccione un empleado'}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown
              size="0.80rem"
              className="text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white text-base shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-3 pl-10 pr-4 ${
                    active ? "bg-red-100" : ""
                  }`
                }
                value={option.id}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.caption}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
                        <FaCheck size="0.5rem" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

// Componente de Entrada de Datos
function InputGroup2({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div className="relative z-0 w-full">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`peer block py-2.5 px-1 w-full text-sm text-gray-600 bg-transparent border-0 border-b-[2px] appearance-none focus:outline-none focus:ring-0 focus:border-[#FF6464] ${
          disabled ? "border-gray-300" : "border-gray-400"
        }`}
        placeholder=" "
        disabled={disabled}
      />
      <label
        htmlFor={name}
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
      >
        {label}
      </label>
    </div>
  );
}

// Componente Principal del Formulario
function SolicitudForm({ solicitud, onClose, onSave }) {
  const [formData, setFormData] = useState({ fecha: '', descripcion: '', estado: '', empleadoId: '' });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false); // Añadir estado de carga
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/empleados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados(response.data);
      } catch (error) {
        setError('Error al obtener empleados.');
        console.error('Error al obtener empleados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();

    if (solicitud) {
      setFormData({
        fecha: solicitud.fecha.split('T')[0],
        descripcion: solicitud.descripcion || '',
        estado: solicitud.estado || '',
        empleadoId: solicitud.empleadoId || '',
      });
    }
  }, [solicitud, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = solicitud ? `http://localhost:3000/api/solicitudes/${solicitud.numero}` : 'http://localhost:3000/api/solicitudes';
    const method = solicitud ? 'PUT' : 'POST';

    setLoading(true);
    try {
      await axios({ method, url, data: formData, headers: { Authorization: `Bearer ${token}` } });
      onSave();
      onClose();
    } catch (error) {
      setError('Error al guardar la solicitud.');
      console.error('Error al guardar la solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white w-full p-5 sm:p-10 gap-8 rounded-md">
      <h3 className="text-lg font-semibold">{solicitud ? 'Actualizar Solicitud' : 'Nueva Solicitud'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup2
          name="fecha"
          label="Fecha"
          type="date"
          value={formData.fecha}
          onChange={handleInputChange}
        />
        <InputGroup2
          name="descripcion"
          label="Descripción"
          value={formData.descripcion}
          onChange={handleInputChange}
        />
        <InputGroup2
          name="estado"
          label="Estado"
          value={formData.estado}
          onChange={handleInputChange}
        />
        {empleados.length > 0 && (
          <SelectMenu1
            value={formData.empleadoId}
            setValue={(value) => setFormData({ ...formData, empleadoId: value })}
            options={empleados.map((empleado) => ({
              id: empleado.id,
              caption: `${empleado.nombres} ${empleado.apellidos}`
            }))}
            className="w-full"
            disabled={false}
          />
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (solicitud ? 'Actualizar' : 'Agregar')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default SolicitudForm;
