import { useCallback, useState } from 'react';

// pageIndex (base 1, spec 7.3), pageSize and their changes (spec 10).
// `reset` goes back to page 1, e.g. when a search or a filter changes.
function usePagination(pageSize = 10) {
  const [pageIndex, setPageIndex] = useState(1);

  const reset = useCallback(() => setPageIndex(1), []);

  const totalPages = useCallback(
    (total) => Math.max(Math.ceil(total / pageSize), 1),
    [pageSize]
  );

  return { pageIndex, pageSize, setPageIndex, reset, totalPages };
}

export default usePagination;
