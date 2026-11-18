import { useEffect, useState } from 'react';

// Returns `value` once it has stopped changing for `delay` ms.
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
