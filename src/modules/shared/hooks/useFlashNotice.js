import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Reads a one-shot notice passed through navigation state:
//   navigate('/admin/x', { state: { notice: { tone: 'success', message } } })
// and clears it from history so a reload does not show it again.
function useFlashNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(() => location.state?.notice ?? null);
  const hasNoticeInHistory = Boolean(location.state?.notice);

  useEffect(() => {
    if (hasNoticeInHistory) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
    }
  }, [hasNoticeInHistory, location.pathname, location.search, navigate]);

  return [notice, setNotice];
}

export default useFlashNotice;
