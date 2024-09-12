import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';

function InputGroup1({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled,
}) {
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

function EmpleadoForm({ employee, onClose, onSave }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState(''); // Campo de apellidos
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth(); // Obtener el token desde el contexto

  useEffect(() => {
    // Si se pasa un empleado para editar, carga los datos en el formulario
    if (employee) {
      setName(employee.nombres || '');
      setLastName(employee.apellidos || ''); // Cargar apellidos
      setPosition(employee.cargo || '');
      setEmail(employee.email || '');
      setTelefono(employee.telefono || '');
      setFechaNacimiento(employee.fechaNacimiento || '');
    }
  }, [employee]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = employee ? `http://localhost:3000/api/empleados/${employee.id}` : 'http://localhost:3000/api/empleados';
    const method = employee ? 'PUT' : 'POST';

    try {
      await axios({
        method,
        url,
        data: { 
          nombres: name,
          apellidos: lastName, 
          cargo: position,
          email,
          telefono,
          fechaNacimiento,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      // Limpiar el formulario y cerrar el modal
      setName('');
      setLastName(''); // Limpiar apellidos
      setPosition('');
      setEmail('');
      setTelefono('');
      setFechaNacimiento('');
      onSave(); // Notificar al componente padre que se guardó un empleado
      onClose();
    } catch (err) {
      setError('Error al guardar el empleado: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-5 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">{employee ? 'Actualizar Empleado' : 'Nuevo Empleado'}</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup1
          name="name"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputGroup1
          name="lastName"
          label="Apellidos"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <InputGroup1
          name="position"
          label="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <InputGroup1
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputGroup1
          name="telefono"
          label="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <InputGroup1
          name="fechaNacimiento"
          label="Fecha de nacimiento"
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Mostrar errores */}

        <div className="mt-4 flex gap-4">
          <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded">{employee ? 'Actualizar' : 'Agregar'}</button>
          <button type='button' onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default EmpleadoForm;

