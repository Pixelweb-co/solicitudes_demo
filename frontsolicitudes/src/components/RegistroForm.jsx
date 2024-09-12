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

  function SelectGroup({ label, name, value, onChange, options }) {
    return (
      <div className="relative z-0 w-full">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="peer block py-2.5 px-1 w-full text-sm text-gray-600 bg-transparent border-0 border-b-[2px] appearance-none focus:outline-none focus:ring-0 focus:border-[#FF6464] border-gray-400"
        >
          <option value="" disabled>{label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={name}
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
        >
          {label}
        </label>
      </div>
    );
  }

  function RegistroForm({ user = null, onClose, onSave }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('empleado');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth(); // Obtener el token desde el contexto

    useEffect(() => {
      // Si se pasa un usuario para editar, carga los datos en el formulario
      if (user) {
        setUsername(user.username || '');
        setEmail(user.email || '');
        setPassword(''); // No se muestra la contraseña actual por seguridad
        setRol(user.rol || 'empleado');
      } else {
        setUsername('');
        setEmail('');
        setPassword('');
        setRol('empleado');
      }
    }, [user]);

    const handleSubmit = async (event) => {
      event.preventDefault();

      const url = user ? `http://localhost:3000/api/usuarios/${user.id}` : 'http://localhost:3000/api/auth/register';
      const method = user ? 'PUT' : 'POST';

      try {
        if(method=="PUT"){
        await axios({
          method,
          url,
          data: { username, password, email, rol },
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          }
        });
      }else{
        await axios({
          method,
          url,
          data: { username, password, email, rol }
        });
      }

        if (onSave) onSave(); // Notificar al componente padre que se guardó un usuario
        if (onClose) onClose(); // Cierra el formulario si se proporcionó onClose
      } catch (err) {
        setError('Error al guardar el usuario: ' + (err.response?.data?.message || err.message));
      }
    };

    return (
      <div className="p-5 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">{user ? 'Actualizar Usuario' : 'Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup1
            name="username"
            label="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputGroup1
            name="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!user} // La contraseña solo es requerida si es un nuevo usuario
          />
          <InputGroup1
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <SelectGroup
            name="rol"
            label="Rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            options={[
              { value: 'empleado', label: 'Empleado' },
              { value: 'administrador', label: 'Administrador' },
            ]}
          />

          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Mostrar errores */}

          <div className="mt-4 flex gap-4">
            <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded">{user ? 'Actualizar' : 'Agregar'}</button>
            <button type='button' onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
         
      </div>
    );
  }

  export default RegistroForm;
