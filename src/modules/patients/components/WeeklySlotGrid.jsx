import { useState } from 'react';
import DayChips from './DayChips';
import SlotButton from './SlotButton';
import Button from '../../shared/components/atoms/Button';
import Icon from '../../shared/components/atoms/Icon';
import Spinner from '../../shared/components/atoms/Spinner';
import Alert from '../../shared/components/molecules/Alert';
import EmptyState from '../../shared/components/molecules/EmptyState';

const NO_SLOTS_DAY = 'No hay turnos disponibles para este día';

function groupByDate(slots) {
  return slots.reduce((groups, slot) => {
    (groups[slot.date] ??= []).push(slot);

    return groups;
  }, {});
}

function DaySlots({ slots, selectedSlotId, onSelect, columnsClass }) {
  if (!slots || slots.length === 0) {
    return <p className="text-xs text-med-text-muted py-2">{NO_SLOTS_DAY}</p>;
  }

  return (
    <div className={`grid gap-2 ${columnsClass}`}>
      {slots.map((slot) => (
        <SlotButton
          key={slot.id}
          slot={slot}
          selected={slot.id === selectedSlotId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function WeeklySlotGrid({
  days,
  slots,
  loading,
  error,
  canGoBack,
  selectedSlotId,
  onPrevious,
  onNext,
  onRetry,
  onSelect,
}) {
  const [mobileDay, setMobileDay] = useState(days[0].iso);
  const groups = groupByDate(slots);
  const activeMobileDay = days.some((day) => day.iso === mobileDay)
    ? mobileDay
    : days[0].iso;
  const countsByDay = Object.fromEntries(
    days.map((day) => [
      day.iso,
      (groups[day.iso] ?? []).filter((slot) => slot.status === 'AVAILABLE')
        .length,
    ])
  );
  const emptyWeek = !loading && !error && slots.length === 0;
  const rangeLabel = `${days[0].longLabel} al ${days[days.length - 1].longLabel}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={!canGoBack || loading}
          aria-label="Semana anterior"
          className="min-h-11 min-w-11"
        >
          <Icon name="chevronLeft" />
        </Button>
        <p className="text-xs sm:text-sm font-semibold text-med-text-sub text-center">
          {rangeLabel}
        </p>
        <Button
          variant="secondary"
          onClick={onNext}
          disabled={loading}
          aria-label="Semana siguiente"
          className="min-h-11 min-w-11"
        >
          <Icon name="chevronRight" />
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-10 text-med-primary-700">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Alert tone="error">
          <span className="flex flex-wrap items-center gap-2">
            {error.message}
            <button
              type="button"
              onClick={onRetry}
              className="font-semibold underline"
            >
              Reintentar
            </button>
          </span>
        </Alert>
      )}

      {emptyWeek && (
        <EmptyState icon="calendar" title="Sin disponibilidad esta semana">
          <p className="text-xs text-med-text-sub">
            Probá con la semana siguiente.
          </p>
        </EmptyState>
      )}

      {!loading && !error && !emptyWeek && (
        <>
          <div className="lg:hidden flex flex-col gap-3">
            <DayChips
              days={days}
              selectedIso={activeMobileDay}
              countsByDay={countsByDay}
              onSelect={setMobileDay}
            />
            <DaySlots
              slots={groups[activeMobileDay]}
              selectedSlotId={selectedSlotId}
              onSelect={onSelect}
              columnsClass="grid-cols-3"
            />
          </div>

          <div className="hidden lg:grid grid-cols-7 gap-3">
            {days.map((day) => (
              <div key={day.iso} className="flex flex-col gap-2">
                <div className="text-center pb-2 border-b border-med-border-subtle">
                  <p className="text-[11px] uppercase text-med-text-muted">
                    {day.weekday}
                  </p>
                  <p className="text-lg font-bold text-med-primary-900">
                    {day.dayNumber}
                  </p>
                </div>
                <DaySlots
                  slots={groups[day.iso]}
                  selectedSlotId={selectedSlotId}
                  onSelect={onSelect}
                  columnsClass="grid-cols-1"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WeeklySlotGrid;
