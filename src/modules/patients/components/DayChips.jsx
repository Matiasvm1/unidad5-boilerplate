function chipClass(selected) {
  if (selected) {
    return 'bg-med-primary-900 text-white border-med-primary-900';
  }

  return 'bg-white text-med-text-main border-med-border';
}

function DayChips({ days, selectedIso, countsByDay, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Días de la semana"
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
    >
      {days.map((day) => {
        const selected = day.iso === selectedIso;
        const count = countsByDay[day.iso] ?? 0;

        return (
          <button
            key={day.iso}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`${day.longLabel}, ${count} horarios disponibles`}
            onClick={() => onSelect(day.iso)}
            className={`shrink-0 min-w-14 min-h-11 px-3 py-2 rounded-xl border flex flex-col items-center ${chipClass(selected)}`}
          >
            <span className="text-[11px] uppercase">{day.weekday}</span>
            <span className="text-base font-bold">{day.dayNumber}</span>
          </button>
        );
      })}
    </div>
  );
}

export default DayChips;
