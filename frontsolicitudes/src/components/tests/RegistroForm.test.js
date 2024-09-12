import { render, screen, fireEvent } from '@testing-library/react';
import RegistroForm from '../../components/RegistroForm';
import { useAuth } from '../../context/authcontext';

jest.mock('../../context/authcontext', () => ({
  useAuth: jest.fn(),
}));

// Configura el valor predeterminado del hook mockeado
const mockUseAuth = useAuth;

describe('RegistroForm Component', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      token: 'mocked-token', // Valor del token mockeado
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should submit registration form', async () => {
    // Renderiza el componente
    render(<RegistroForm />);

    // Encuentra los campos del formulario y completa los valores
    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });

    // Envía el formulario
    fireEvent.click(screen.getByText(/Agregar/i));

    // Asume que deberías verificar el comportamiento esperado
    // (esto puede incluir la verificación de la llamada a la API, la actualización del estado, etc.)
  });
});
