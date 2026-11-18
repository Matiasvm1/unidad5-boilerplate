// Dates travel as "YYYY-MM-DD" strings. They are built from local calendar
// parts (never toISOString, which shifts to UTC and can change the day).
// Spec 7.2: this is the only place where dates are converted.

const WEEK_LENGTH = 7;

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// "2026-08-10" -> local Date at midnight.
function fromIsoDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function addDays(iso, amount) {
  const date = fromIsoDate(iso);

  date.setDate(date.getDate() + amount);

  return toIsoDate(date);
}

function todayIso() {
  return toIsoDate(new Date());
}

const weekdayFormatter = new Intl.DateTimeFormat('es-AR', { weekday: 'short' });
const longFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
const shortMonthFormatter = new Intl.DateTimeFormat('es-AR', {
  month: 'short',
});

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// The 7 days of the visible window, starting at `from`.
function buildWeek(from) {
  return Array.from({ length: WEEK_LENGTH }, (_, offset) => {
    const iso = addDays(from, offset);
    const date = fromIsoDate(iso);

    return {
      iso,
      weekday: capitalize(weekdayFormatter.format(date).replace('.', '')),
      dayNumber: date.getDate(),
      longLabel: formatLongDate(iso),
    };
  });
}

// "2026-08-10" -> "Lunes 10 de agosto" (spec 7.1: no comma after the weekday)
function formatLongDate(iso) {
  return capitalize(longFormatter.format(fromIsoDate(iso)).replace(',', ''));
}

// "2026-10-24" -> "24 oct 2026"
function formatShortDate(iso) {
  const date = fromIsoDate(iso);
  const month = shortMonthFormatter.format(date).replace('.', '');

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

// "2026-08-10 09:00" (search response) -> { date: "2026-08-10", time: "09:00" }
function splitDateTime(value) {
  const [date = '', time = ''] = (value ?? '').split(' ');

  return { date, time };
}

// True when the local date and time "YYYY-MM-DD HH:mm" is already behind `now`.
function isPastDateTime(value, now = new Date()) {
  const { date, time } = splitDateTime(value);

  if (!date || !time) {
    return false;
  }

  const moment = fromIsoDate(date);
  const [hours, minutes] = time.split(':').map(Number);

  moment.setHours(hours, minutes, 0, 0);

  return moment.getTime() <= now.getTime();
}

export {
  WEEK_LENGTH,
  toIsoDate,
  addDays,
  todayIso,
  buildWeek,
  formatLongDate,
  formatShortDate,
  splitDateTime,
  isPastDateTime,
};
