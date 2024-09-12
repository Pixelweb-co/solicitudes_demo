import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Crear un proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = (newToken, userInfo) => {
    setToken(newToken);
    setUser(userInfo);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto en otros componentes
export const useAuth = () => useContext(AuthContext);
