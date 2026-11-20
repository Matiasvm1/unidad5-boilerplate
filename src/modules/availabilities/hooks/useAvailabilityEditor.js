import { useCallback, useMemo, useState } from 'react';
import useDoctorAvailability from './useDoctorAvailability';
import {
  createAvailability,
  updateAvailability,
} from '../services/availabilitiesService';
import { monthOptions, toRows } from '../utils/schedule';

const SAVED_MESSAGE = 'Disponibilidad guardada';

// State of the weekly schedule editor for one doctor: the month picked, the
// schedule loaded for it, the form rows and the save. Saving sends a POST when
// the month has no schedule yet and a PUT when it already has one.
function useAvailabilityEditor(doctorId) {
  const months = useMemo(() => monthOptions(), []);
  const [monthValue, setMonthValue] = useState(months[0].value);
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { year, month } = months.find((option) => option.value === monthValue);
  const schedule = useDoctorAvailability(doctorId, year, month);
  const isEdit = schedule.availabilities.length > 0;
  const { rows, hasExtraRanges } = useMemo(
    () => toRows(schedule.availabilities),
    [schedule.availabilities]
  );

  const clearMessages = useCallback(() => {
    setNotice('');
    setErrorMessage('');
  }, []);

  const selectMonth = (value) => {
    clearMessages();
    setMonthValue(value);
  };

  const save = async (days) => {
    clearMessages();
    const body = { doctorId, days, year, month };

    try {
      if (isEdit) {
        await updateAvailability(body);
      } else {
        await createAvailability(body);
      }

      setNotice(SAVED_MESSAGE);
      schedule.reload();
    } catch (apiError) {
      setErrorMessage(apiError.message);
    }
  };

  return {
    months,
    monthValue,
    selectMonth,
    schedule,
    rows,
    hasExtraRanges,
    isEdit,
    save,
    notice,
    errorMessage,
    clearMessages,
  };
}

export default useAvailabilityEditor;
