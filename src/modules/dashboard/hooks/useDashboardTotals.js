import useTotal from './useTotal';
import { getAppointmentsByDate } from '../services/dashboardService';
import {
  getDoctors,
  getSpecialties,
} from '../../shared/services/catalogService';
import { todayIso } from '../../shared/utils/dates';

// The loaders live outside the hooks so they keep the same identity between
// renders (useTotal re-runs when its loader changes).
const loadDoctors = () => getDoctors({ pageIndex: 1, pageSize: 1 });
const loadSpecialties = () => getSpecialties({ pageIndex: 1, pageSize: 1 });
const loadTodayBooked = () =>
  getAppointmentsByDate({ date: todayIso(), status: 'BOOKED', pageSize: 1 });

// The three dashboard counters. Each one loads and fails on its own.
function useDashboardTotals() {
  return {
    doctors: useTotal(loadDoctors),
    specialties: useTotal(loadSpecialties),
    todayBooked: useTotal(loadTodayBooked),
  };
}

export default useDashboardTotals;
