const request = require('supertest');
const express = require('express');
const app = express();
const db = require('../models'); // Asegúrate de tener el modelo correctamente importado
const Usuario = db.Usuario;

app.use(express.json());
app.use('/api/auth', require('../routes/auth.routes')); // Ajusta la ruta si es necesario

// Antes de ejecutar las pruebas, limpia la base de datos
beforeAll(async () => {
  await Usuario.sync({ force: true }); // Limpia y recrea las tablas
});

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register') // Actualiza la ruta para que coincida con la correcta
      .send({
        username: 'uniqueuser1',
        email: 'uniqueuser1@example.com',
        password: 'securepassword123',
        rol: 'administrador'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.username).toBe('uniqueuser1');
  });

  it('should not register a user with an existing email', async () => {
    // Primero registramos un usuario
    await request(app)
      .post('/api/auth/register') // Actualiza la ruta
      .send({
        username: 'uniqueuser2',
        email: 'uniqueuser2@example.com',
        password: 'anotherpassword123',
        rol: 'empleado'
      });

    // Intentamos registrar otro usuario con el mismo email
    const response = await request(app)
      .post('/api/auth/register') // Actualiza la ruta
      .send({
        username: 'anotheruser',
        email: 'uniqueuser2@example.com',
        password: 'yetanotherpassword123',
        rol: 'administrador'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already in use');
  });

  it('should login a user', async () => {
    // Primero registramos un usuario
    await request(app)
      .post('/api/auth/register') // Actualiza la ruta
      .send({
        username: 'uniqueuser3',
        email: 'uniqueuser3@example.com',
        password: 'yetanotherpassword123',
        rol: 'administrador'
      });

    // Luego intentamos iniciar sesión con esos datos
    const response = await request(app)
      .post('/api/auth/login') 
      .send({
        email: 'uniqueuser3@example.com',
        password: 'yetanotherpassword123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('uniqueuser3@example.com');
  });

  it('should not login with incorrect password', async () => {
    // Primero registramos un usuario
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'uniqueuser4',
        email: 'uniqueuser4@example.com',
        password: 'securepassword456',
        rol: 'empleado'
      });

    // Intentamos iniciar sesión con una contraseña incorrecta
    const response = await request(app)
      .post('/api/auth/login') 
      .send({
        email: 'uniqueuser4@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
