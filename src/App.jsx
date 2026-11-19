import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import router from './router';

function App() {
  return (
    // authprov va por fuera para q todas las pantallas pueda saber quien esta logeado
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
// routerprov activa el sistema de rutas con la config de router.jsx

export default App;
