// es la credencial del medico q elegis, muestra a quien le estamos armando la agenda

function DoctorSummary({ doctor }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg bg-med-primary-50 border border-med-border">
      <p className="font-semibold text-med-primary-900">{doctor.name}</p>
      <p className="text-xs text-med-text-sub">
        Matrícula: {doctor.licenseNumber ?? '-'}
      </p>

      <p className="text-xs text-med-text-sub">
        Especialidad: {doctor.specialty?.name ?? 'Sin especialidad'}
      </p>
    </div>
  );
}

export default DoctorSummary;
// con ?? como un medico puede no tener cargada la matricula, manejamos los vacios
// en vez de que la pantalla reviente por mostrar algo que no tiene, dice que si la matri es null muestre un guion
