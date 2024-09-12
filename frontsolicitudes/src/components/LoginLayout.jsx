import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { Link } from 'react-router-dom';

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

function LoginLayout() {
  const { login } = useAuth(); // Obtener la función login del contexto
  const [email, setEmail] = useState('');
  const [rol, setRol]=useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página

    try {
      // Realiza la solicitud de login
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      // Si el login es exitoso, almacena el token y el usuario en el contexto y redirige
      if (response.data.token) {
        login(response.data.token, response.data.user); // Usar la función login del contexto
        window.location.href = '/principal';
      }
    } catch (err) {
      // Manejo de errores
      setError('Login fallido: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-5 bg-white rounded-md shadow-md max-w-sm mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      {/* Formulario de login */}
      <form onSubmit={handleLogin}>
        <InputGroup1
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputGroup1
          name="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Mostrar errores */}

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Iniciar sesión</button>
        </div>
      </form>
      <p className="mt-4">
        ¿Nuevo usuario?{' '}
        <Link to="/registro" className="text-blue-500 hover:underline">Crear una cuenta</Link>
      </p>
    </div>
  );
}

export default LoginLayout;
