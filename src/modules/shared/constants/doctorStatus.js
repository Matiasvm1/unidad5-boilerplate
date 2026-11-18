// Doctor state (spec 7.6, D39): hasAvailability -> label and badge tone.
// "Sin agenda" uses the warning colour (spec 13).
function availabilityInfo(hasAvailability) {
  if (hasAvailability) {
    return { label: 'Con agenda', tone: 'success' };
  }

  return { label: 'Sin agenda', tone: 'warning' };
}

export { availabilityInfo };
