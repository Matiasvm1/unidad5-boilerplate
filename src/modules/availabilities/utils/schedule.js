// Filas semanales q muestra el form, recorda que "code" es el valor que acepta la API
const WEEK_DAYS = [
  { code: 'LUNES', label: 'Lunes' },
  { code: 'MARTES', label: 'Martes' },
  { code: 'MIERCOLES', label: 'Miércoles' },
  { code: 'JUEVES', label: 'Jueves' },
  { code: 'VIERNES', label: 'Viernes' },
  { code: 'SABADO', label: 'Sábado' },
  { code: 'DOMINGO', label: 'Domingo' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '13:00';
const MONTHS_AHEAD = 12;

// El back solo acepta turnos multiplos de 30min, entonces armamos una lista fija de 48 opciones
const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, '0');
  const minutes = index % 2 === 0 ? '00' : '30';

  return `${hours}:${minutes}`;
});

// El back tiene los textos con tildes entonces creamos esta funcion para limpiarlas
function normalizeDay(day) {
  return String(day).normalize('NFD').replace(/\p{M}/gu, '').toUpperCase();
}

function emptyRows() {
  return WEEK_DAYS.map(({ code }) => ({
    day: code,
    active: false,
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
  }));
}

// Agarra las 7 filas vacias de empty rows y busca si el back mando el horario para ese dia
// si encuentra algo prende el interruptor y copia las hs

function toRows(availabilities) {
  const seen = new Set();
  let hasExtraRanges = false;

  const sorted = [...availabilities].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const rows = emptyRows().map((row) => {
    const match = sorted.find((item) => normalizeDay(item.day) === row.day);

    if (!match) {
      return row;
    }

    return {
      ...row,
      active: true,
      startTime: match.startTime,
      endTime: match.endTime,
    };
  });

  sorted.forEach((item) => {
    const day = normalizeDay(item.day);

    if (seen.has(day)) {
      hasExtraRanges = true;
    }

    seen.add(day);
  });

  return { rows, hasExtraRanges };
}

// agarra las 7 filas visuales y filtra descartando los dias apagados, empaquetando solo los dias activos

function toPayloadDays(rows) {
  return rows
    .filter((row) => row.active)
    .map(({ day, startTime, endTime }) => ({ day, startTime, endTime }));
}

// Arma la lista del mes actual y de los proximos 12 meses. Usa UTC
//

function monthOptions(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return Array.from({ length: MONTHS_AHEAD + 1 }, (_, offset) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1)
    );
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const label = formatter.format(date);

    return {
      value: `${year}-${month}`,
      year,
      month,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });
}

export {
  WEEK_DAYS,
  TIME_OPTIONS,
  emptyRows,
  toRows,
  toPayloadDays,
  monthOptions,
  normalizeDay,
};
