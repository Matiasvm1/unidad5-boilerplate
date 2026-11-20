import Avatar from '../../shared/components/atoms/Avatar';

function DoctorCard({ doctor }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-med-primary-50 border border-med-border">
      <Avatar name={doctor.name} size="lg" />
      <div className="min-w-0">
        <p className="font-bold text-med-primary-900 truncate">{doctor.name}</p>
        <p className="text-xs text-med-text-sub">
          {doctor.specialty?.name ?? 'Sin especialidad'}
        </p>
      </div>
    </div>
  );
}

export default DoctorCard;
