import { createContext, useState } from 'react';
import * as authService from '../services/authService';
import {
  clearSession,
  readSession,
  saveSession,
} from '../../shared/api/sessionStore';

// guarda la sesion en memoria y ofrece los login y logout

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  // Recuperar la sesion para que cada vez que se haga f5 no se inicien de nuevo las credenciales
  const [session, setSession] = useState(readSession); // sin parentesis para que react lo ejecute una vez al principio o con f5

  const startSession = (newSession) => {
    saveSession(newSession);
    setSession(newSession);

    return newSession;
  };

  //los errores se propagan como apierror para que cada formulario decida q mostrar
  const loginAdmin = async ({ email, password }) => {
    const data = await authService.loginAdmin({ email, password }); // llama al backend

    return startSession({ token: data.token, role: data.role, email });
  };

  const loginPatient = async ({ email, dni, fullName }) => {
    const data = await authService.loginPatient({ email, dni, fullName });

    return startSession({
      token: data.token,
      role: data.role,
      email,
      dni: data.dni,
      patientId: data.patientId,
    });
  };

  // protected route re dirige  al usuario al inicio de sesion de la zona en la que se encontraba
  const logout = () => {
    clearSession();
    setSession(null);
  };

  return (
    // expone para que todos lo vean
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        role: session?.role ?? null,
        loginAdmin,
        loginPatient,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
