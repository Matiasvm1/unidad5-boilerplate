const BASE = 'min-h-11 w-full px-2 py-2 rounded-lg text-sm font-semibold border transition';

function stateClass (available, selected) {
    if (!available) {
        return 'bg-gray-50 text-med-text-muted border-med-border-subtle line-through cursor-not-allowed';
    }
    if (selected) {
        return 'bg-med-primary-900 text-white border-med-primary-900';
    }
    return 'bg-white text-med-primary-700 border-med-border hover:border-med-primary-600 hover:bg-med-primary-50';
}


function SlotButton ({ slot, selected, onSelect}) {
    const available = slot.status === 'AVAiLABLE';

    return (
        <button
            type="button"
            disabled={!available}
            aria-pressed={available ? selected : undefined}
            aria-label={`${slot.startTime}${available ? '' : ', no disponible'}`}
            onClick={() => onSelect(slot)}
            className={`${BASE} ${stateClass(available, selected)}`}
        >
            {slot.startTime}
        </button>
    );
}


export default SlotButton;