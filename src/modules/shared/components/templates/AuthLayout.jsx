import Icon from '../atoms/Icon';

// encabezado de las paginas login y registro que comparten ambas
function AuthLayout({ children, footer }) {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <Icon name="shield" className="w-8 h-8 text-med-primary-900" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </div>

      <section className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        {children}
      </section>

      {footer && <div className="mt-6 text-center">{footer}</div>}
    </main>
  );
}

// marco de cuadro que comparten los dos logins. Es el fondo azul oscuro, el escudo blanco arriba
// y la caja blanca del centro. Recibe children que es el contenido de la caja blanca y footer (el link para cambiar de portal)
export default AuthLayout;
