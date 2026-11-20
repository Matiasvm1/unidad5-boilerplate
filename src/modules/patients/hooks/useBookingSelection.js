import { useCallback, useState } from 'react';
import useSlots from './useSlots';
import {
  WEEK_LENGTH,
  addDays,
  buildWeek,
  todayIso,
} from '../../shared/utils/dates';
import useDoctorsBySpecialty from '../../shared/hooks/useDoctorsBySpecialty';
import useSpecialtyOptions from '../../shared/hooks/useSpecialtyOptions';

// What the patient is choosing on the booking page: specialty, doctor, the
// week shown and the selected slot. Changing any of them clears the slot and
// calls onChange, so the page can clear its messages.
function useBookingSelection({ onChange } = {}) {
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [from, setFrom] = useState(todayIso);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const specialties = useSpecialtyOptions();
  const doctors = useDoctorsBySpecialty(specialtyId);
  const doctor = doctors.doctors.find((option) => option.id === doctorId);
  const to = addDays(from, WEEK_LENGTH - 1);
  const slots = useSlots(doctor ? doctorId : '', from, to);

  const resetSlot = () => {
    setSelectedSlot(null);
    onChange?.();
  };

  const changeSpecialty = (value) => {
    setSpecialtyId(value);
    setDoctorId('');
    setFrom(todayIso());
    resetSlot();
  };

  const changeDoctor = (value) => {
    setDoctorId(value);
    setFrom(todayIso());
    resetSlot();
  };

  const moveWeek = (direction) => {
    setFrom((current) => addDays(current, direction * WEEK_LENGTH));
    resetSlot();
  };

  const selectSlot = (slot) => {
    setSelectedSlot(slot);
    onChange?.();
  };

  const clearSlot = useCallback(() => setSelectedSlot(null), []);

  return {
    specialties,
    doctors,
    doctor,
    specialtyId,
    doctorId,
    from,
    days: buildWeek(from),
    canGoBack: from > todayIso(),
    slots,
    selectedSlot,
    changeSpecialty,
    changeDoctor,
    moveWeek,
    selectSlot,
    clearSlot,
  };
}

export default useBookingSelection;
